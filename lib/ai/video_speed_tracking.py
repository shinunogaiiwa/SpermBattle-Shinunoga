"""
从视频中检测精子并估算运动速度。

实现思路：
- 使用 YOLOv5 (DetectMultiBackend) 对视频逐帧检测。
- 基于检测到的框中心，通过匈牙利算法 (内部实现的 linear_sum_assignment) 将相邻帧目标关联成轨迹。
- 轨迹允许短暂的丢失 (max_age)，超过阈值自动终止。
- 依据视频帧率计算像素速度，可选像素尺寸换算物理速度。
- 结果输出为 JSON，包含每条轨迹的速度片段以及整体统计。

依赖：numpy、torch、opencv-python、tqdm（随 YOLOv5 requirements 已包含）。
"""

from __future__ import annotations

import argparse
import json
import math
from dataclasses import dataclass, field, asdict
from pathlib import Path
from typing import Dict, List, Optional, Tuple

import cv2
import numpy as np
import torch
from tqdm import tqdm

from models.common import DetectMultiBackend
from utils.datasets import LoadImages
from utils.general import LOGGER, check_img_size, non_max_suppression, scale_coords
from utils.matching import linear_sum_assignment
from utils.torch_utils import select_device


@dataclass
class Track:
    track_id: int
    class_id: int
    class_name: str
    last_frame: int
    last_center: Tuple[float, float]
    segments: List[Dict[str, float]] = field(default_factory=list)
    speed_px_history: List[float] = field(default_factory=list)
    speed_physical_history: List[float] = field(default_factory=list)
    time_since_update: int = 0
    emit_segments: bool = False

    def update(
        self,
        frame_idx: int,
        center: Tuple[float, float],
        fps: float,
        pixel_size: float,
    ) -> None:
        dt = frame_idx - self.last_frame
        if dt <= 0:
            dt = 1  # 避免异常
        distance = math.hypot(center[0] - self.last_center[0], center[1] - self.last_center[1])
        speed_px = distance * fps / dt
        speed_phys = speed_px * pixel_size
        if self.emit_segments:
            self.segments.append(
                {
                    "start_frame": self.last_frame,
                    "end_frame": frame_idx,
                    "speed_px_per_s": speed_px,
                    "speed_physical_per_s": speed_phys,
                }
            )
        self.speed_px_history.append(speed_px)
        self.speed_physical_history.append(speed_phys)
        self.last_frame = frame_idx
        self.last_center = center
        self.time_since_update = 0


def associate_detections_to_tracks(
    tracks: List[Track],
    detections: List[Tuple[np.ndarray, int]],
    max_distance: float,
) -> Tuple[List[Tuple[int, int]], List[int], List[int]]:
    """
    按检测结果与现有轨迹计算匹配。

    detections: list of (bbox_xyxy, class_id)
    """
    if not tracks or not detections:
        matched = []
        unmatched_tracks = list(range(len(tracks)))
        unmatched_dets = list(range(len(detections)))
        return matched, unmatched_tracks, unmatched_dets

    cost = np.full((len(tracks), len(detections)), fill_value=max_distance + 1, dtype=np.float32)
    det_centers = [
        ((bbox[0] + bbox[2]) / 2.0, (bbox[1] + bbox[3]) / 2.0) for bbox, _ in detections
    ]

    for t_idx, track in enumerate(tracks):
        for d_idx, center in enumerate(det_centers):
            dist = math.hypot(center[0] - track.last_center[0], center[1] - track.last_center[1])
            cost[t_idx, d_idx] = dist

    row_ind, col_ind = linear_sum_assignment(cost)

    matched, unmatched_tracks, unmatched_dets = [], set(range(len(tracks))), set(range(len(detections)))
    for r, c in zip(row_ind, col_ind):
        if cost[r, c] <= max_distance:
            matched.append((r, c))
            unmatched_tracks.discard(r)
            unmatched_dets.discard(c)

    return matched, list(unmatched_tracks), list(unmatched_dets)


def summarize_tracks(tracks: List[Track]) -> Dict[str, float]:
    pixel_speeds = [s for t in tracks for s in t.speed_px_history]
    physical_speeds = [s for t in tracks for s in t.speed_physical_history]
    if not pixel_speeds:
        return {}

    def _stats(values: List[float]) -> Dict[str, float]:
        vals = sorted(values)
        n = len(vals)
        median = vals[n // 2] if n % 2 == 1 else (vals[n // 2 - 1] + vals[n // 2]) / 2
        return {
            "count": n,
            "min": vals[0],
            "max": vals[-1],
            "mean": float(sum(vals) / n),
            "median": float(median),
        }

    return {
        "pixel_speed_stats": _stats(pixel_speeds),
        "physical_speed_stats": _stats(physical_speeds),
    }


def detect_and_track(
    weights: Path,
    source: Path,
    imgsz: int,
    conf_thres: float,
    iou_thres: float,
    device: str,
    pixel_size: float,
    max_distance: float,
    max_age: int,
    class_filter: Optional[List[int]],
    output: Path,
    emit_segments: bool,
    preview_path: Optional[Path] = None,
) -> None:
    device = select_device(device)
    model = DetectMultiBackend(weights, device=device)
    stride, names, pt = model.stride, model.names, model.pt
    imgsz = check_img_size(imgsz, s=stride)
    
    # 调试：输出模型类别名称
    print("\n" + "="*60)
    print("=== DEBUG: 模型类别信息 ===")
    print(f"模型类别名称列表: {names}")
    print(f"类别数量: {len(names)}")
    print("="*60 + "\n")

    dataset = LoadImages(str(source), img_size=imgsz, stride=stride, auto=pt)
    if not any(dataset.video_flag):
        raise ValueError("当前脚本仅支持单个视频源。请提供视频文件路径。")

    fps = dataset.cap.get(5)  # cv2.CAP_PROP_FPS == 5
    if not fps or not math.isfinite(fps):
        LOGGER.warning("视频 FPS 未获取到，使用默认 30.")
        fps = 30.0

    tracks: List[Track] = []
    next_track_id = 0

    model.warmup(imgsz=(1 if pt else 1, 3, imgsz, imgsz))

    preview_written = False

    # OpenCV expects BGR color tuples.
    class_colors = {
        "sperm": (0, 0, 255),  # normal -> red
        "normal": (0, 0, 255),
        "cluster": (0, 255, 0),  # green
        "small_or_pinhead": (255, 0, 0),  # blue
        "pinhead": (255, 0, 0),
    }
    fallback_color = (68, 87, 255)  # default to a red-ish tone (BGR)
    for frame_idx, (_, im, im0, _, _) in enumerate(tqdm(dataset, desc="Detecting"), start=0):
        if dataset.mode != "video":
            continue

        im_tensor = torch.from_numpy(im).to(device)
        im_tensor = im_tensor.float()
        im_tensor /= 255.0
        if im_tensor.ndim == 3:
            im_tensor = im_tensor.unsqueeze(0)

        pred = model(im_tensor, augment=False, visualize=False)
        pred = non_max_suppression(pred, conf_thres, iou_thres, classes=class_filter)

        detections: List[Tuple[np.ndarray, int]] = []
        det = pred[0]
        if len(det):
            det[:, :4] = scale_coords(im_tensor.shape[2:], det[:, :4], im0.shape).round()
            for *xyxy, conf, cls in det:
                cls_id = int(cls.item())
                detections.append((torch.tensor(xyxy).cpu().numpy(), cls_id))

        if preview_path and not preview_written and len(detections):
            annotated = im0.copy()
            # 调试：预览图生成时的类别和颜色信息
            print("\n" + "="*60)
            print("=== DEBUG: 预览图生成 ===")
            print(f"第一帧检测到的框数量: {len(detections)}")
            color_count = {"red": 0, "green": 0, "blue": 0, "other": 0}
            for bbox, cls_id in detections:
                x1, y1, x2, y2 = bbox.astype(int)
                name = names[cls_id] if cls_id < len(names) else str(cls_id)
                color = class_colors.get(name.lower(), fallback_color)
                # 统计颜色
                if color == (0, 0, 255):
                    color_count["red"] += 1
                elif color == (0, 255, 0):
                    color_count["green"] += 1
                elif color == (255, 0, 0):
                    color_count["blue"] += 1
                else:
                    color_count["other"] += 1
                print(f"  cls_id={cls_id}, name='{name}', color={color} (BGR)")
                cv2.rectangle(annotated, (x1, y1), (x2, y2), color, 2)
            print(f"颜色统计: 红色={color_count['red']}, 绿色={color_count['green']}, 蓝色={color_count['blue']}, 其他={color_count['other']}")
            print("="*60 + "\n")
            preview_path.parent.mkdir(parents=True, exist_ok=True)
            cv2.imwrite(str(preview_path), annotated)
            preview_written = True

        # 匹配
        matched, unmatched_tracks, unmatched_dets = associate_detections_to_tracks(
            tracks, detections, max_distance=max_distance
        )

        # 更新已匹配轨迹
        for t_idx, d_idx in matched:
            bbox, cls_id = detections[d_idx]
            cx = float((bbox[0] + bbox[2]) / 2.0)
            cy = float((bbox[1] + bbox[3]) / 2.0)
            tracks[t_idx].update(frame_idx, (cx, cy), fps=fps, pixel_size=pixel_size)

        # 未匹配轨迹更新时间
        for t_idx in unmatched_tracks:
            tracks[t_idx].time_since_update += 1

        # 新建轨迹
        for d_idx in unmatched_dets:
            bbox, cls_id = detections[d_idx]
            cx = float((bbox[0] + bbox[2]) / 2.0)
            cy = float((bbox[1] + bbox[3]) / 2.0)
            track = Track(
                track_id=next_track_id,
                class_id=cls_id,
                class_name=names[cls_id],
                last_frame=frame_idx,
                last_center=(cx, cy),
                emit_segments=emit_segments,
            )
            tracks.append(track)
            next_track_id += 1

        # 移除长时间未更新的轨迹
        tracks = [t for t in tracks if t.time_since_update <= max_age]

    output.parent.mkdir(parents=True, exist_ok=True)
    summary = summarize_tracks(tracks)
    payload = {
        "video": str(source),
        "fps": fps,
        "pixel_size": pixel_size,
        "max_distance": max_distance,
        "max_age": max_age,
        "tracks": [],
        "summary": summary,
    }
    if preview_path and preview_written:
        payload["preview_image"] = str(preview_path)
    for t in tracks:
        stats = summarize_tracks([t])
        track_info = {
            "id": t.track_id,
            "class_id": t.class_id,
            "class_name": t.class_name,
            "sample_count": len(t.speed_px_history),
            "speed_px_stats": stats.get("pixel_speed_stats") if stats else None,
            "speed_physical_stats": stats.get("physical_speed_stats") if stats else None,
        }
        if emit_segments:
            track_info["segments"] = t.segments
        payload["tracks"].append(track_info)

    with output.open("w", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=False, indent=2)
    print(f"速度统计已写入 {output}")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="使用 YOLOv5 估算视频中精子的运动速度")
    parser.add_argument("--weights", type=Path, default=Path("best.pt"), help="模型权重路径")
    parser.add_argument("--source", type=Path, required=True, help="视频文件路径")
    parser.add_argument("--imgsz", type=int, default=640, help="推理输入尺寸")
    parser.add_argument("--conf-thres", type=float, default=0.25, help="置信度阈值")
    parser.add_argument("--iou-thres", type=float, default=0.45, help="NMS IoU 阈值")
    parser.add_argument("--device", type=str, default="", help="推理设备，如 '0' 或 'cpu'")
    parser.add_argument(
        "--pixel-size",
        type=float,
        default=1.0,
        help="像素对应的物理长度（单位自定义，例如微米），默认 1 表示仅输出像素速度",
    )
    parser.add_argument(
        "--max-distance",
        type=float,
        default=80.0,
        help="轨迹匹配允许的最大像素距离",
    )
    parser.add_argument(
        "--max-age",
        type=int,
        default=5,
        help="轨迹允许丢失的最大帧数，超过将终止该轨迹",
    )
    parser.add_argument(
        "--classes",
        type=int,
        nargs="*",
        default=None,
        help="仅检测这些类别 id，默认为全部类别",
    )
    parser.add_argument(
        "--output",
        type=Path,
        default=Path("runs/speed/speed_summary.json"),
        help="速度统计输出路径 (JSON)",
    )
    parser.add_argument(
        "--emit-segments",
        action="store_true",
        help="是否在输出中包含逐段速度记录（可能体积较大）",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    detect_and_track(
        weights=args.weights,
        source=args.source,
        imgsz=args.imgsz,
        conf_thres=args.conf_thres,
        iou_thres=args.iou_thres,
        device=args.device,
        pixel_size=args.pixel_size,
        max_distance=args.max_distance,
        max_age=args.max_age,
        class_filter=args.classes,
        output=args.output,
        emit_segments=args.emit_segments,
    )


if __name__ == "__main__":
    main()
