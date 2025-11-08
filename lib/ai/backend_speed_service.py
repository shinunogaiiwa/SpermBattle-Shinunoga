"""
后端可直接调用的速度分析封装。

典型流程：
    from backend_speed_service import SpeedAnalyzer
    analyzer = SpeedAnalyzer()
    result = analyzer.run(video_path="path/to/video.mp4", pixel_size=0.32)

返回值为字典，可直接返回给 REST 接口或写入数据库。
"""

from __future__ import annotations

import json
import threading
from pathlib import Path
from typing import Optional

from video_speed_tracking import detect_and_track


class SpeedAnalyzer:
    """
    提供线程安全的模型推理封装，可在后端服务中复用。

    每次调用 run() 时允许覆盖个别参数，其余沿用初始化配置。
    """

    def __init__(
        self,
        weights: Path | str = Path("sample_YOLO_models/best.pt"),
        imgsz: int = 640,
        conf_thres: float = 0.25,
        iou_thres: float = 0.45,
        device: str = "",
        max_distance: float = 80.0,
        max_age: int = 5,
        output_dir: Path | str = Path("runs/speed"),
        emit_segments: bool = False,
    ) -> None:
        self.weights = Path(weights)
        self.imgsz = imgsz
        self.conf_thres = conf_thres
        self.iou_thres = iou_thres
        self.device = device
        self.max_distance = max_distance
        self.max_age = max_age
        self.output_dir = Path(output_dir)
        self.emit_segments = emit_segments
        self._lock = threading.Lock()

    def run(
        self,
        video_path: Path | str,
        pixel_size: float = 1.0,
        output_path: Optional[Path | str] = None,
        class_filter: Optional[list[int]] = None,
    ) -> dict:
        """
        执行速度分析并返回字典结果。

        :param video_path: 视频文件路径
        :param pixel_size: 像素到物理距离换算（单位自定义）
        :param output_path: 可选，自定义结果 JSON 保存位置；默认保存在 output_dir
        :param class_filter: 可选，只关注指定类别 id
        """
        video_path = Path(video_path).resolve()
        if not video_path.exists():
            raise FileNotFoundError(f"视频不存在：{video_path}")

        if output_path:
            output_path = Path(output_path).resolve()
        else:
            safe_name = video_path.stem.replace(" ", "_")
            output_path = (self.output_dir / f"{safe_name}_speed.json").resolve()

        output_path.parent.mkdir(parents=True, exist_ok=True)

        # YOLOv5 DetectMultiBackend 会在 GPU/CPU 间初始化全局状态，串行执行以避免冲突
        with self._lock:
            detect_and_track(
                weights=self.weights,
                source=video_path,
                imgsz=self.imgsz,
                conf_thres=self.conf_thres,
                iou_thres=self.iou_thres,
                device=self.device,
                pixel_size=pixel_size,
                max_distance=self.max_distance,
                max_age=self.max_age,
                class_filter=class_filter,
                output=output_path,
                emit_segments=self.emit_segments,
            )

        return json.loads(output_path.read_text(encoding="utf-8"))


if __name__ == "__main__":
    analyzer = SpeedAnalyzer()
    result = analyzer.run(video_path="../sample_video/11.mp4", pixel_size=0.32)
    print(json.dumps(result["summary"], ensure_ascii=False, indent=2))


