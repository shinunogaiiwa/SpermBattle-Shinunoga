from __future__ import annotations

import logging
import shutil
import sys
import tempfile
from pathlib import Path
from typing import Any, Optional

from fastapi import UploadFile

from . import mock_data, schemas

logger = logging.getLogger(__name__)

REPO_ROOT = Path(__file__).resolve().parents[2]
AI_DIR = REPO_ROOT / "lib" / "ai"
AI_MEDIA_ROOT = AI_DIR / "runs"
MEDIA_URL_PREFIX = "/media/ai"

if AI_DIR.exists() and str(AI_DIR) not in sys.path:
  sys.path.insert(0, str(AI_DIR))

try:
  from backend_speed_service import SpeedAnalyzer  # type: ignore[attr-defined]
except ModuleNotFoundError as exc:  # pragma: no cover - ensures clearer error at runtime
  missing = getattr(exc, "name", "unknown dependency")
  raise RuntimeError(
    "Unable to import the AI analyzer. Missing dependency: {0}. "
    "Ensure `lib/ai` is present and install backend requirements.".format(missing)
  ) from exc

_analyzer: SpeedAnalyzer | None = None


def _get_analyzer() -> SpeedAnalyzer:
  global _analyzer
  if _analyzer is None:
    weights = (AI_DIR / "best.pt").resolve()
    output_dir = (AI_DIR / "runs" / "speed").resolve()
    preview_dir = output_dir / "previews"
    _analyzer = SpeedAnalyzer(weights=weights, output_dir=output_dir, preview_dir=preview_dir)
  return _analyzer


async def analyze_upload(
  file: UploadFile, pixel_size: float = 1.0
) -> schemas.Analysis:
  temp_path = await _persist_upload(file)
  try:
    logger.info("Starting AI analysis for %s", file.filename or temp_path.name)
    payload: dict[str, Any] = _get_analyzer().run(
      video_path=temp_path, pixel_size=pixel_size
    )
  finally:
    try:
      temp_path.unlink(missing_ok=True)
    except FileNotFoundError:
      pass

  return mock_data.register_ai_analysis(
    file_name=file.filename or temp_path.name,
    ai_payload=payload,
    pixel_size=pixel_size,
    annotated_image_url=_to_media_url(payload.get("preview_image")),
  )


async def _persist_upload(file: UploadFile) -> Path:
  suffix = Path(file.filename or "").suffix or ".bin"
  temp_dir = Path(tempfile.gettempdir()) / "spermbattle_uploads"
  temp_dir.mkdir(parents=True, exist_ok=True)

  await file.seek(0)
  with tempfile.NamedTemporaryFile(
    delete=False, suffix=suffix, dir=temp_dir
  ) as tmp_file:
    shutil.copyfileobj(file.file, tmp_file)
    temp_path = Path(tmp_file.name)

  return temp_path


def _to_media_url(path: Optional[str | Path]) -> Optional[str]:
  if not path:
    return None
  target = Path(path).resolve()
  try:
    rel = target.relative_to(AI_MEDIA_ROOT)
  except ValueError:
    return None
  rel_path = rel.as_posix()
  return f"{MEDIA_URL_PREFIX}/{rel_path}"
