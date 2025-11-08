// Type definitions for SpermWars platform

export interface Analysis {
  id: number;
  user_id: number;
  username: string;
  country: string;
  total_sperm: number;
  normal_count: number;
  cluster_count: number;
  pinhead_count: number;
  quality_score: number;
  quantity_score: number;
  morphology_score: number;
  motility_score: number;
  title: string;
  title_category: 'GOD' | 'MID' | 'TRASH' | 'OMEGA';
  annotated_image_url: string;
  global_rank: number;
  percentile: number;
  created_at: string;
  // Gaming stats
  wins?: number;
  losses?: number;
  win_rate?: number;
}

export interface LeaderboardEntry {
  rank: number;
  analysis_id: number;
  user_id: number;
  username: string;
  title: string;
  title_category: 'GOD' | 'MID' | 'TRASH' | 'OMEGA';
  score: number;
  country: string;
  country_flag: string;
  wins?: number;
  losses?: number;
  win_rate?: number;
}

export interface Battle {
  id: number;
  user1: {
    analysis_id: number;
    username: string;
    title: string;
    score: number;
    country: string;
    country_flag: string;
    quantity_score: number;
    morphology_score: number;
    motility_score: number;
  };
  user2: {
    analysis_id: number;
    username: string;
    title: string;
    score: number;
    country: string;
    country_flag: string;
    quantity_score: number;
    morphology_score: number;
    motility_score: number;
  };
  winner_id: number;
  score_difference: number;
  created_at: string;
}

export interface UploadResponse {
  success: boolean;
  analysis_id: number;
  message: string;
}

// Gaming types
export interface SpermFighter {
  id: string;
  name: string;
  speed: number; // μm/s
  attack: number;
  defense: number;
  hp: number;
  maxHp: number;
  analysisId: number;
}

export interface RaceParticipant {
  fighter: SpermFighter;
  username: string;
  country_flag: string;
  position: number; // 0-100%
  finished: boolean;
}

export interface Race {
  id: number;
  participants: RaceParticipant[];
  status: 'waiting' | 'racing' | 'finished';
  winner?: number; // analysisId
}

export interface ArenaSkill {
  id: string;
  name: string;
  description: string;
  emoji: string;
}

export interface BattleAction {
  turn: number;
  attacker: string;
  skill: ArenaSkill;
  damage?: number;
  effect: string;
}
