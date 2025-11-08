// Mock data for demo purposes
import { Analysis, LeaderboardEntry, Battle } from '@/types';

// Country flags and names
export const COUNTRIES: Record<string, { flag: string; name: string }> = {
  US: { flag: '🇺🇸', name: 'United States' },
  CA: { flag: '🇨🇦', name: 'Canada' },
  GB: { flag: '🇬🇧', name: 'United Kingdom' },
  CN: { flag: '🇨🇳', name: 'China' },
  JP: { flag: '🇯🇵', name: 'Japan' },
  KR: { flag: '🇰🇷', name: 'South Korea' },
  DE: { flag: '🇩🇪', name: 'Germany' },
  FR: { flag: '🇫🇷', name: 'France' },
  AU: { flag: '🇦🇺', name: 'Australia' },
  BR: { flag: '🇧🇷', name: 'Brazil' },
};

// Mean but playful title system - SpermWars style!
export const TITLES = {
  GOD: {
    '95-100': ['🏆 Sperm Deity', '🏆 Fertility Deity'],
    '90-94': ['💪 Fertility Beast', '💪 Alpha Breeder'],
    '85-89': ['🔥 Baby Maker Supreme', '🔥 Population Booster'],
    '80-84': ['👑 King of Raw Dogs', '👑 Condom Hater'],
  },
  MID: {
    '75-79': ['🤷 Normie NPC', '🤷 Average Joe'],
    '70-74': ['🥱 Could Be Worse', '🥱 Mediocre Mike'],
    '65-69': ['😅 Try Harder Buddy', '😅 Participation Trophy'],
    '60-64': ['🫤 Kinda Mid TBH', '🫤 Disappointment'],
  },
  TRASH: {
    '55-59': ['😭 Pre-Erectile Dysfunction', '😭 Almost There Chief'],
    '50-54': ['🐛 Smol Bean Energy', '🐛 Microscopic Warrior'],
    '45-49': ['🤏 Please Don\'t Reproduce', '🤏 Adoption Ambassador'],
    '40-44': ['☠️ Fertility Black Hole', '☠️ Void of Life'],
  },
  OMEGA: {
    '35-39': ['💀 Sperm Parking Lot', '💀 They Ain\'t Moving Chief'],
    '30-34': ['🪦 Sperm Cemetery', '🪦 F in the Chat'],
    '20-29': ['🚫 Bloodline Ender', '🚫 Family Tree Terminator'],
    '0-19': ['🏴‍☠️ Population Crisis Solver', '🏴‍☠️ Extinction Helper'],
  },
};

// Helper to get title based on score
const getTitleByScore = (score: number): { title: string; category: 'GOD' | 'MID' | 'TRASH' | 'OMEGA' } => {
  let category: 'GOD' | 'MID' | 'TRASH' | 'OMEGA';
  let range: string;
  
  if (score >= 95) { category = 'GOD'; range = '95-100'; }
  else if (score >= 90) { category = 'GOD'; range = '90-94'; }
  else if (score >= 85) { category = 'GOD'; range = '85-89'; }
  else if (score >= 80) { category = 'GOD'; range = '80-84'; }
  else if (score >= 75) { category = 'MID'; range = '75-79'; }
  else if (score >= 70) { category = 'MID'; range = '70-74'; }
  else if (score >= 65) { category = 'MID'; range = '65-69'; }
  else if (score >= 60) { category = 'MID'; range = '60-64'; }
  else if (score >= 55) { category = 'TRASH'; range = '55-59'; }
  else if (score >= 50) { category = 'TRASH'; range = '50-54'; }
  else if (score >= 45) { category = 'TRASH'; range = '45-49'; }
  else if (score >= 40) { category = 'TRASH'; range = '40-44'; }
  else if (score >= 35) { category = 'OMEGA'; range = '35-39'; }
  else if (score >= 30) { category = 'OMEGA'; range = '30-34'; }
  else if (score >= 20) { category = 'OMEGA'; range = '20-29'; }
  else { category = 'OMEGA'; range = '0-19'; }
  
  const titles = TITLES[category][range as keyof typeof TITLES[typeof category]];
  const title = titles[Math.floor(Math.random() * titles.length)];
  
  return { title, category };
};

// Generate mock analyses with more variance (include Hall of Shame candidates!)
export const generateMockAnalyses = (count: number = 100): Analysis[] => {
  const analyses: Analysis[] = [];
  const countries = Object.keys(COUNTRIES);

  for (let i = 0; i < count; i++) {
    // Create more variance - include some REALLY bad scores for Hall of Shame
    let qualityScore: number;
    if (i < 10) {
      // Top 10 are gods
      qualityScore = Math.max(85, Math.min(100, 90 + Math.random() * 10));
    } else if (i < 40) {
      // Next 30 are mid to good
      qualityScore = Math.max(60, Math.min(90, 70 + Math.random() * 20));
    } else if (i < 80) {
      // Most are trash tier
      qualityScore = Math.max(40, Math.min(65, 50 + Math.random() * 15));
    } else {
      // Last 20 are OMEGA tier for entertainment
      qualityScore = Math.max(8, Math.min(40, 15 + Math.random() * 25));
    }
    
    const quantityScore = Math.max(10, Math.min(100, qualityScore + (Math.random() * 20 - 10)));
    const morphologyScore = Math.max(10, Math.min(100, qualityScore + (Math.random() * 15 - 7)));
    const motilityScore = Math.max(10, Math.min(100, qualityScore + (Math.random() * 18 - 9)));

    const { title, category: titleCategory } = getTitleByScore(qualityScore);

    const country = countries[Math.floor(Math.random() * countries.length)];
    const totalSperm = Math.floor(20 + Math.random() * 110);
    const normalCount = Math.floor(totalSperm * (qualityScore / 100) * 0.7);
    const clusterCount = Math.floor(totalSperm * 0.2);
    const pinheadCount = totalSperm - normalCount - clusterCount;

    // Gaming stats
    const totalGames = Math.floor(Math.random() * 150);
    const winRate = Math.max(0.1, Math.min(0.95, (qualityScore / 100) + (Math.random() * 0.2 - 0.1)));
    const wins = Math.floor(totalGames * winRate);
    const losses = totalGames - wins;

    analyses.push({
      id: i + 1,
      user_id: i + 1,
      username: `user_${Math.random().toString(36).substr(2, 9)}`,
      country,
      total_sperm: totalSperm,
      normal_count: normalCount,
      cluster_count: clusterCount,
      pinhead_count: pinheadCount,
      quality_score: Math.round(qualityScore * 10) / 10,
      quantity_score: Math.round(quantityScore * 10) / 10,
      morphology_score: Math.round(morphologyScore * 10) / 10,
      motility_score: Math.round(motilityScore * 10) / 10,
      title,
      title_category: titleCategory,
      annotated_image_url: '/placeholder-sperm.jpg',
      global_rank: i + 1,
      percentile: Math.round((1 - i / count) * 100 * 10) / 10,
      created_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      wins,
      losses,
      win_rate: Math.round(winRate * 100),
    });
  }

  // Sort by quality score descending
  analyses.sort((a, b) => b.quality_score - a.quality_score);

  // Update ranks
  analyses.forEach((analysis, index) => {
    analysis.global_rank = index + 1;
    analysis.percentile = Math.round((1 - index / count) * 100 * 10) / 10;
  });

  return analyses;
};

// Mock analyses database
export const mockAnalyses = generateMockAnalyses(100);

// Get leaderboard with new simplified categories
export const getLeaderboard = (
  category?: 'global' | 'shame' | 'gaming'
): LeaderboardEntry[] => {
  let filtered = [...mockAnalyses];

  if (category === 'shame') {
    // Hall of Shame - worst scores first
    filtered.sort((a, b) => a.quality_score - b.quality_score);
    return filtered.slice(0, 100).map((analysis, index) => ({
      rank: index + 1,
      analysis_id: analysis.id,
      user_id: analysis.user_id,
      username: analysis.username,
      title: analysis.title,
      score: analysis.quality_score,
      country: analysis.country,
      country_flag: COUNTRIES[analysis.country].flag,
    }));
  } else if (category === 'gaming') {
    // Gaming leaderboard - by win rate
    filtered.sort((a, b) => (b.win_rate || 0) - (a.win_rate || 0));
    return filtered.slice(0, 50).map((analysis, index) => ({
      rank: index + 1,
      analysis_id: analysis.id,
      user_id: analysis.user_id,
      username: analysis.username,
      title: analysis.title,
      score: analysis.win_rate || 0,
      country: analysis.country,
      country_flag: COUNTRIES[analysis.country].flag,
    }));
  }

  // Global - by quality score (default)
  return filtered.slice(0, 50).map((analysis, index) => ({
    rank: index + 1,
    analysis_id: analysis.id,
    user_id: analysis.user_id,
    username: analysis.username,
    title: analysis.title,
    score: analysis.quality_score,
    country: analysis.country,
    country_flag: COUNTRIES[analysis.country].flag,
  }));
};

// Get user's analysis
export const getAnalysisById = (id: number): Analysis | null => {
  return mockAnalyses.find(a => a.id === id) || null;
};

// Create mock battle
export const createBattle = (analysisId: number): Battle => {
  const userAnalysis = getAnalysisById(analysisId);
  if (!userAnalysis) throw new Error('Analysis not found');

  // Find opponent with similar score (±15 points)
  const opponents = mockAnalyses.filter(
    a =>
      a.id !== analysisId &&
      Math.abs(a.quality_score - userAnalysis.quality_score) <= 15
  );

  const opponent =
    opponents[Math.floor(Math.random() * opponents.length)] ||
    mockAnalyses[Math.floor(Math.random() * 20)];

  const winner =
    userAnalysis.quality_score >= opponent.quality_score
      ? userAnalysis.user_id
      : opponent.user_id;

  return {
    id: Math.floor(Math.random() * 10000),
    user1: {
      analysis_id: userAnalysis.id,
      username: userAnalysis.username,
      title: userAnalysis.title,
      score: userAnalysis.quality_score,
      country: userAnalysis.country,
      country_flag: COUNTRIES[userAnalysis.country].flag,
      quantity_score: userAnalysis.quantity_score,
      morphology_score: userAnalysis.morphology_score,
      motility_score: userAnalysis.motility_score,
    },
    user2: {
      analysis_id: opponent.id,
      username: opponent.username,
      title: opponent.title,
      score: opponent.quality_score,
      country: opponent.country,
      country_flag: COUNTRIES[opponent.country].flag,
      quantity_score: opponent.quantity_score,
      morphology_score: opponent.morphology_score,
      motility_score: opponent.motility_score,
    },
    winner_id: winner,
    score_difference: Math.abs(
      userAnalysis.quality_score - opponent.quality_score
    ),
    created_at: new Date().toISOString(),
  };
};

// Simulate upload and analysis
export const simulateAnalysis = (file: File): Promise<Analysis> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const qualityScore = Math.max(
        15,
        Math.min(98, 65 + Math.random() * 30)
      );
      const quantityScore = Math.max(
        10,
        Math.min(95, qualityScore + (Math.random() * 20 - 10))
      );
      const morphologyScore = Math.max(
        10,
        Math.min(95, qualityScore + (Math.random() * 15 - 7))
      );
      const motilityScore = Math.max(
        10,
        Math.min(95, qualityScore + (Math.random() * 18 - 9))
      );

      const { title, category: titleCategory } = getTitleByScore(qualityScore);

      const totalSperm = Math.floor(20 + Math.random() * 100);
      const normalCount = Math.floor(totalSperm * (qualityScore / 100) * 0.7);
      const clusterCount = Math.floor(totalSperm * 0.2);
      const pinheadCount = totalSperm - normalCount - clusterCount;

      const totalGames = Math.floor(Math.random() * 50);
      const winRate = Math.max(0.1, Math.min(0.95, (qualityScore / 100) + (Math.random() * 0.2 - 0.1)));
      const wins = Math.floor(totalGames * winRate);
      const losses = totalGames - wins;

      const newAnalysis: Analysis = {
        id: mockAnalyses.length + 1,
        user_id: 9999,
        username: 'YOU',
        country: 'US',
        total_sperm: totalSperm,
        normal_count: normalCount,
        cluster_count: clusterCount,
        pinhead_count: pinheadCount,
        quality_score: Math.round(qualityScore * 10) / 10,
        quantity_score: Math.round(quantityScore * 10) / 10,
        morphology_score: Math.round(morphologyScore * 10) / 10,
        motility_score: Math.round(motilityScore * 10) / 10,
        title,
        title_category: titleCategory,
        annotated_image_url: URL.createObjectURL(file),
        global_rank: mockAnalyses.filter(a => a.quality_score > qualityScore)
          .length + 1,
        percentile:
          Math.round(
            (1 -
              mockAnalyses.filter(a => a.quality_score > qualityScore).length /
                mockAnalyses.length) *
              100 *
              10
          ) / 10,
        created_at: new Date().toISOString(),
        wins,
        losses,
        win_rate: Math.round(winRate * 100),
      };

      mockAnalyses.push(newAnalysis);
      resolve(newAnalysis);
    }, 2500); // Simulate processing time
  });
};

