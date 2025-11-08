// Analysis result from backend
export interface Analysis {
  id: number;
  total_sperm: number;
  normal_count: number;
  cluster_count: number;
  pinhead_count: number;
  quality_score: number;
  quantity_score: number;
  morphology_score: number;
  motility_score: number;
  title: string;
  title_category: "S" | "A" | "B" | "C" | "F";
  annotated_image_url: string;
  global_rank: number;
  percentile: number;
  created_at: string;
}

// Leaderboard entry
export interface LeaderboardEntry {
  rank: number;
  analysis_id: number;
  username: string;
  title: string;
  score: number;
  country: string;
}

// Battle/PK result
export interface Battle {
  battle_id: number;
  player1: LeaderboardEntry;
  player2: LeaderboardEntry;
  winner_id: number;
  score_diff: number;
  details: {
    quantity: { you: number; opponent: number; winner: string };
    morphology: { you: number; opponent: number; winner: string };
    motility: { you: number; opponent: number; winner: string };
    overall: { you: number; opponent: number; winner: string };
  };
}

// Racing game
export interface RacePlayer {
  id: string;
  username: string;
  sperm_name: string;
  speed: number;
  position: number; // 0-100%
}

