from __future__ import annotations

from datetime import datetime
from typing import Literal, Optional

from pydantic import BaseModel

TitleCategory = Literal["GOD", "MID", "TRASH", "OMEGA"]


class Analysis(BaseModel):
  id: int
  user_id: int
  username: str
  country: str
  total_sperm: int
  normal_count: int
  cluster_count: int
  pinhead_count: int
  quality_score: float
  quantity_score: float
  morphology_score: float
  motility_score: float
  title: str
  title_category: TitleCategory
  annotated_image_url: str
  global_rank: int
  percentile: float
  created_at: datetime
  wins: Optional[int] = None
  losses: Optional[int] = None
  win_rate: Optional[float] = None


class LeaderboardEntry(BaseModel):
  rank: int
  analysis_id: int
  user_id: int
  username: str
  title: str
  title_category: TitleCategory
  score: float
  country: str
  country_flag: str
  wins: Optional[int] = None
  losses: Optional[int] = None
  win_rate: Optional[float] = None


class BattleUser(BaseModel):
  analysis_id: int
  username: str
  title: str
  score: float
  country: str
  country_flag: str
  quantity_score: float
  morphology_score: float
  motility_score: float


class Battle(BaseModel):
  id: int
  user1: BattleUser
  user2: BattleUser
  winner_id: int
  score_difference: float
  created_at: datetime


class BattleRequest(BaseModel):
  analysis_id: int
