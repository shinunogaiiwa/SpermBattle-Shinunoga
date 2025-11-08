from __future__ import annotations

from typing import Literal, Optional

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from . import mock_data, schemas

app = FastAPI(title="SpermBattle API", version="0.1.0")

app.add_middleware(
  CORSMiddleware,
  allow_origins=["*"],
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)


@app.get("/health")
def health_check() -> dict[str, str]:
  return {"status": "ok"}


@app.get(
  "/api/leaderboard",
  response_model=list[schemas.LeaderboardEntry],
)
def read_leaderboard(
  category: Optional[Literal["global", "shame", "gaming"]] = "global",
) -> list[schemas.LeaderboardEntry]:
  return mock_data.get_leaderboard(category)


@app.get(
  "/api/analysis/{analysis_id}",
  response_model=schemas.Analysis,
)
def read_analysis(analysis_id: int) -> schemas.Analysis:
  analysis = mock_data.get_analysis_by_id(analysis_id)
  if not analysis:
    raise HTTPException(status_code=404, detail="Analysis not found")
  return analysis


@app.post(
  "/api/analysis/upload",
  response_model=schemas.Analysis,
)
async def upload_analysis(file: UploadFile = File(...)) -> schemas.Analysis:
  if not file:
    raise HTTPException(status_code=400, detail="File upload required")
  await file.read()  # ensure stream consumed before generating mock analysis
  return mock_data.simulate_analysis(file.filename)


@app.post(
  "/api/battle",
  response_model=schemas.Battle,
)
def create_battle(payload: schemas.BattleRequest) -> schemas.Battle:
  try:
    return mock_data.create_battle(payload.analysis_id)
  except ValueError as exc:
    raise HTTPException(status_code=404, detail=str(exc)) from exc


@app.get(
  "/api/battle/{battle_id}",
  response_model=schemas.Battle,
)
def read_battle(battle_id: int) -> schemas.Battle:
  battle = mock_data.get_battle_by_id(battle_id)
  if not battle:
    raise HTTPException(status_code=404, detail="Battle not found")
  return battle
