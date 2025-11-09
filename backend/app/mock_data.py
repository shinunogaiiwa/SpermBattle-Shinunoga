from __future__ import annotations

import math
import random
from datetime import datetime, timedelta
from typing import Any, Dict, List, Literal, Optional, Tuple

from . import schemas

COUNTRIES: Dict[str, Dict[str, str]] = {
  "US": {"flag": "🇺🇸", "name": "United States"},
  "CA": {"flag": "🇨🇦", "name": "Canada"},
  "GB": {"flag": "🇬🇧", "name": "United Kingdom"},
  "CN": {"flag": "🇨🇳", "name": "China"},
  "JP": {"flag": "🇯🇵", "name": "Japan"},
  "KR": {"flag": "🇰🇷", "name": "South Korea"},
  "DE": {"flag": "🇩🇪", "name": "Germany"},
  "FR": {"flag": "🇫🇷", "name": "France"},
  "AU": {"flag": "🇦🇺", "name": "Australia"},
  "BR": {"flag": "🇧🇷", "name": "Brazil"},
}

TitleRange = Literal[
  "95-100",
  "90-94",
  "85-89",
  "80-84",
  "75-79",
  "70-74",
  "65-69",
  "60-64",
  "55-59",
  "50-54",
  "45-49",
  "40-44",
  "35-39",
  "30-34",
  "20-29",
  "0-19",
]

TITLES: Dict[schemas.TitleCategory, Dict[TitleRange, List[str]]] = {
  "GOD": {
    "95-100": ["🏆 Sperm Deity", "🏆 Fertility Deity"],
    "90-94": ["💪 Fertility Beast", "💪 Alpha Breeder"],
    "85-89": ["🔥 Baby Maker Supreme", "🔥 Population Booster"],
    "80-84": ["👑 King of Raw Dogs", "👑 Condom Hater"],
  },
  "MID": {
    "75-79": ["🤷 Normie NPC", "🤷 Average Joe"],
    "70-74": ["🥱 Could Be Worse", "🥱 Mediocre Mike"],
    "65-69": ["😅 Try Harder Buddy", "😅 Participation Trophy"],
    "60-64": ["🫤 Kinda Mid TBH", "🫤 Disappointment"],
  },
  "TRASH": {
    "55-59": ["😭 Pre-Erectile Dysfunction", "😭 Almost There Chief"],
    "50-54": ["🐛 Smol Bean Energy", "🐛 Microscopic Warrior"],
    "45-49": ["🤏 Please Don't Reproduce", "🤏 Adoption Ambassador"],
    "40-44": ["☠️ Fertility Black Hole", "☠️ Void of Life"],
  },
  "OMEGA": {
    "35-39": ["💀 Sperm Parking Lot", "💀 They Ain't Moving Chief"],
    "30-34": ["🪦 Sperm Cemetery", "🪦 F in the Chat"],
    "20-29": ["🚫 Bloodline Ender", "🚫 Family Tree Terminator"],
    "0-19": ["🏴‍☠️ Population Crisis Solver", "🏴‍☠️ Extinction Helper"],
  },
}


def _clamp(value: float, minimum: float = 0.0, maximum: float = 100.0) -> float:
  return max(minimum, min(maximum, value))


def _clamp_fraction(value: float) -> float:
  return max(0.05, min(0.95, value))

mock_analyses: List[schemas.Analysis] = []
mock_battles: Dict[int, schemas.Battle] = {}
analysis_counter = 0
battle_counter = 0


def _get_title_by_score(
  score: float,
) -> Tuple[str, schemas.TitleCategory]:
  if score >= 95:
    category: schemas.TitleCategory = "GOD"
    range_key: TitleRange = "95-100"
  elif score >= 90:
    category = "GOD"
    range_key = "90-94"
  elif score >= 85:
    category = "GOD"
    range_key = "85-89"
  elif score >= 80:
    category = "GOD"
    range_key = "80-84"
  elif score >= 75:
    category = "MID"
    range_key = "75-79"
  elif score >= 70:
    category = "MID"
    range_key = "70-74"
  elif score >= 65:
    category = "MID"
    range_key = "65-69"
  elif score >= 60:
    category = "MID"
    range_key = "60-64"
  elif score >= 55:
    category = "TRASH"
    range_key = "55-59"
  elif score >= 50:
    category = "TRASH"
    range_key = "50-54"
  elif score >= 45:
    category = "TRASH"
    range_key = "45-49"
  elif score >= 40:
    category = "TRASH"
    range_key = "40-44"
  elif score >= 35:
    category = "OMEGA"
    range_key = "35-39"
  elif score >= 30:
    category = "OMEGA"
    range_key = "30-34"
  elif score >= 20:
    category = "OMEGA"
    range_key = "20-29"
  else:
    category = "OMEGA"
    range_key = "0-19"

  titles = TITLES[category][range_key]
  return random.choice(titles), category


def _random_date_within(days: int = 30) -> datetime:
  delta = timedelta(days=random.random() * days)
  return datetime.utcnow() - delta


def _recalculate_ranks() -> None:
  global mock_analyses
  sorted_analyses = sorted(
    mock_analyses, key=lambda analysis: analysis.quality_score, reverse=True
  )
  total = len(sorted_analyses)
  updated: List[schemas.Analysis] = []
  for index, analysis in enumerate(sorted_analyses):
    percentile = round((1 - index / total) * 100, 1) if total else 0
    updated.append(
      analysis.copy(
        update={
          "global_rank": index + 1,
          "percentile": percentile,
        },
      )
    )
  mock_analyses = updated


def _generate_mock_analyses(count: int = 100) -> List[schemas.Analysis]:
  analyses: List[schemas.Analysis] = []
  countries = list(COUNTRIES.keys())

  for idx in range(count):
    if idx < 10:
      quality = max(85, min(100, 90 + random.random() * 10))
    elif idx < 40:
      quality = max(60, min(90, 70 + random.random() * 20))
    elif idx < 80:
      quality = max(40, min(65, 50 + random.random() * 15))
    else:
      quality = max(8, min(40, 15 + random.random() * 25))

    quantity = max(10, min(100, quality + (random.random() * 20 - 10)))
    morphology = max(10, min(100, quality + (random.random() * 15 - 7)))
    motility = max(10, min(100, quality + (random.random() * 18 - 9)))

    title, category = _get_title_by_score(quality)
    country = random.choice(countries)
    total_sperm = random.randint(20, 130)
    normal_count = math.floor(total_sperm * (quality / 100) * 0.7)
    cluster_count = math.floor(total_sperm * 0.2)
    pinhead_count = total_sperm - normal_count - cluster_count

    total_games = random.randint(0, 150)
    win_rate = max(0.1, min(0.95, quality / 100 + (random.random() * 0.2 - 0.1)))
    wins = math.floor(total_games * win_rate)
    losses = total_games - wins

    analyses.append(
      schemas.Analysis(
        id=idx + 1,
        user_id=idx + 1,
        username=f"user_{random.randint(1000, 999999)}",
        country=country,
        total_sperm=total_sperm,
        normal_count=normal_count,
        cluster_count=cluster_count,
        pinhead_count=pinhead_count,
        quality_score=round(quality, 1),
        quantity_score=round(quantity, 1),
        morphology_score=round(morphology, 1),
        motility_score=round(motility, 1),
        title=title,
        title_category=category,
        annotated_image_url="/placeholder-sperm.svg",
        global_rank=idx + 1,
        percentile=0,
        created_at=_random_date_within(),
        wins=wins,
        losses=losses,
        win_rate=round(win_rate * 100, 1),
      )
    )

  return analyses


def _ensure_seed_data() -> None:
  global mock_analyses, analysis_counter
  if mock_analyses:
    return
  mock_analyses = _generate_mock_analyses()
  _recalculate_ranks()
  analysis_counter = len(mock_analyses)


_ensure_seed_data()


def get_analysis_by_id(analysis_id: int) -> Optional[schemas.Analysis]:
  return next((a for a in mock_analyses if a.id == analysis_id), None)


def get_leaderboard(
  category: Optional[Literal["global", "shame", "gaming"]] = None,
) -> List[schemas.LeaderboardEntry]:
  entries = list(mock_analyses)

  if category == "shame":
    entries.sort(key=lambda a: a.quality_score)
  elif category == "gaming":
    entries.sort(key=lambda a: a.win_rate or 0, reverse=True)
  else:
    entries.sort(key=lambda a: a.quality_score, reverse=True)

  limit = 50 if category != "shame" else 100
  result: List[schemas.LeaderboardEntry] = []
  for rank, analysis in enumerate(entries[:limit], start=1):
    score = (
      analysis.quality_score
      if category in (None, "global", "shame")
      else (analysis.win_rate or 0)
    )
    result.append(
      schemas.LeaderboardEntry(
        rank=rank,
        analysis_id=analysis.id,
        user_id=analysis.user_id,
        username=analysis.username,
        title=analysis.title,
        title_category=analysis.title_category,
        score=round(score, 1),
        country=analysis.country,
        country_flag=COUNTRIES[analysis.country]["flag"],
        wins=analysis.wins,
        losses=analysis.losses,
        win_rate=analysis.win_rate,
      )
    )
  return result


def register_ai_analysis(
  file_name: str,
  ai_payload: Dict[str, Any],
  pixel_size: float = 1.0,
  annotated_image_url: Optional[str] = None,
) -> schemas.Analysis:
  global analysis_counter
  summary = (ai_payload or {}).get("summary") or {}
  speed_stats = summary.get("physical_speed_stats") or summary.get(
    "pixel_speed_stats"
  ) or {}
  fallback_stats = summary.get("pixel_speed_stats") or {}

  def _stat(name: str) -> float:
    raw = speed_stats.get(name) if speed_stats else None
    if raw is None:
      raw = fallback_stats.get(name)
    return float(raw or 0.0)

  mean_speed = _stat("mean")
  max_speed = _stat("max")
  sample_count = int(speed_stats.get("count") or fallback_stats.get("count") or 0)

  tracks = ai_payload.get("tracks") or []
  track_count = len(tracks)
  active_tracks = 0
  for track in tracks:
    stats = track.get("speed_physical_stats") or track.get("speed_px_stats") or {}
    track_mean = float(stats.get("mean") or 0.0)
    if track_mean >= 5.0:
      active_tracks += 1
  normal_ratio = active_tracks / track_count if track_count else 0.0

  total_sperm = max(track_count * 5, 5 if track_count else 3)
  normal_count = max(1, int(total_sperm * max(0.25, normal_ratio * 0.9)))
  cluster_count = max(0, int(total_sperm * 0.15))
  pinhead_count = max(0, total_sperm - normal_count - cluster_count)

  speed_component = _clamp(mean_speed * (2.0 if pixel_size == 1.0 else 1.2), 0, 80)
  burst_component = _clamp(max_speed * 0.25, 0, 20)
  coverage_component = _clamp(normal_ratio * 25, 0, 25)
  quality_score = _clamp(20 + speed_component + burst_component + coverage_component)

  quantity_score = _clamp(15 + track_count * 4 + sample_count / 150, 10, 100)
  morphology_score = _clamp(30 + normal_ratio * 50 + min(track_count, 20), 10, 100)
  motility_score = _clamp(quality_score * 0.85 + speed_component * 0.2, 15, 100)

  title, category = _get_title_by_score(quality_score)

  total_games = max(5, min(150, track_count * 3 or sample_count // 200 or 12))
  win_rate_fraction = _clamp_fraction(
    0.35 + (quality_score / 200) + normal_ratio * 0.3
  )
  wins = int(round(total_games * win_rate_fraction))
  losses = max(0, total_games - wins)
  win_rate = round(win_rate_fraction * 100, 1)

  analysis_counter += 1
  analysis_id = analysis_counter
  analysis = schemas.Analysis(
    id=analysis_id,
    user_id=10_000 + analysis_id,
    username="YOU",
    country="US",
    total_sperm=total_sperm,
    normal_count=normal_count,
    cluster_count=cluster_count,
    pinhead_count=pinhead_count,
    quality_score=round(quality_score, 1),
    quantity_score=round(quantity_score, 1),
    morphology_score=round(morphology_score, 1),
    motility_score=round(motility_score, 1),
    title=title,
    title_category=category,
    annotated_image_url=annotated_image_url or "/placeholder-sperm.svg",
    global_rank=0,
    percentile=0,
    created_at=datetime.utcnow(),
    wins=wins,
    losses=losses,
    win_rate=win_rate,
  )
  mock_analyses.append(analysis)
  _recalculate_ranks()
  return get_analysis_by_id(analysis.id) or analysis


def simulate_analysis(file_name: str) -> schemas.Analysis:
  global analysis_counter
  quality = max(15, min(98, 65 + random.random() * 30))
  quantity = max(10, min(95, quality + (random.random() * 20 - 10)))
  morphology = max(10, min(95, quality + (random.random() * 15 - 7)))
  motility = max(10, min(95, quality + (random.random() * 18 - 9)))
  total_sperm = random.randint(20, 120)
  normal_count = math.floor(total_sperm * (quality / 100) * 0.7)
  cluster_count = math.floor(total_sperm * 0.2)
  pinhead_count = total_sperm - normal_count - cluster_count
  title, category = _get_title_by_score(quality)
  total_games = random.randint(5, 50)
  win_rate = max(0.1, min(0.95, quality / 100 + (random.random() * 0.2 - 0.1)))
  wins = math.floor(total_games * win_rate)
  losses = total_games - wins

  analysis_counter += 1
  new_analysis = schemas.Analysis(
    id=analysis_counter,
    user_id=9999,
    username="YOU",
    country="US",
    total_sperm=total_sperm,
    normal_count=normal_count,
    cluster_count=cluster_count,
    pinhead_count=pinhead_count,
    quality_score=round(quality, 1),
    quantity_score=round(quantity, 1),
    morphology_score=round(morphology, 1),
    motility_score=round(motility, 1),
    title=title,
    title_category=category,
    annotated_image_url="/placeholder-sperm.svg",
    global_rank=0,
    percentile=0,
    created_at=datetime.utcnow(),
    wins=wins,
    losses=losses,
    win_rate=round(win_rate * 100, 1),
  )
  mock_analyses.append(new_analysis)
  _recalculate_ranks()
  return get_analysis_by_id(new_analysis.id) or new_analysis


def create_battle(analysis_id: int) -> schemas.Battle:
  global battle_counter
  user_analysis = get_analysis_by_id(analysis_id)
  if not user_analysis:
    raise ValueError("Analysis not found")

  opponents = [
    analysis
    for analysis in mock_analyses
    if analysis.id != analysis_id
    and abs(analysis.quality_score - user_analysis.quality_score) <= 15
  ]
  opponent = (
    random.choice(opponents)
    if opponents
    else random.choice(mock_analyses[: min(20, len(mock_analyses))])
  )

  battle_counter += 1
  winner_id = (
    user_analysis.id
    if user_analysis.quality_score >= opponent.quality_score
    else opponent.id
  )

  battle = schemas.Battle(
    id=battle_counter,
    user1=_to_battle_user(user_analysis),
    user2=_to_battle_user(opponent),
    winner_id=winner_id,
    score_difference=round(
      abs(user_analysis.quality_score - opponent.quality_score), 1
    ),
    created_at=datetime.utcnow(),
  )
  mock_battles[battle.id] = battle
  return battle


def _to_battle_user(analysis: schemas.Analysis) -> schemas.BattleUser:
  return schemas.BattleUser(
    analysis_id=analysis.id,
    username=analysis.username,
    title=analysis.title,
    score=analysis.quality_score,
    country=analysis.country,
    country_flag=COUNTRIES[analysis.country]["flag"],
    quantity_score=analysis.quantity_score,
    morphology_score=analysis.morphology_score,
    motility_score=analysis.motility_score,
  )


def get_battle_by_id(battle_id: int) -> Optional[schemas.Battle]:
  return mock_battles.get(battle_id)
