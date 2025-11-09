// frontend/lib/roastGenerator.ts

export interface RoastData {
  speed_roast: string;
  morphology_roast: string;
  quantity_roast: string;
  motility_roast: string;
  overall_roast: string;
}

export interface Badge {
  id: string;
  emoji: string;
  title: string;
  desc: string;
}

export function generateRoasts(analysis: {
  quality_score: number;
  quantity_score: number;
  morphology_score: number;
  motility_score: number;
  total_sperm: number;
  normal_count: number;
  cluster_count: number;
  pinhead_count: number;
}): RoastData {
  
  // Speed Roast based on motility_score
  let speed_roast = "";
  if (analysis.motility_score < 30) {
    speed_roast = "Your swimmers move like they're stuck in maple syrup 🍁";
  } else if (analysis.motility_score < 50) {
    speed_roast = "At this speed, they'll reach the egg around your retirement age 👴";
  } else if (analysis.motility_score < 70) {
    speed_roast = "Your sperm move slower than a Windows Update 💤";
  } else if (analysis.motility_score < 85) {
    speed_roast = "Not bad, but Usain Bolt wouldn't be impressed 🏃";
  } else {
    speed_roast = "Damn, Usain Bolt would be jealous! ⚡";
  }

  // Morphology Roast based on abnormal ratio
  const abnormal_ratio = ((analysis.total_sperm - analysis.normal_count) / Math.max(analysis.total_sperm, 1)) * 100;
  let morphology_roast = "";
  if (analysis.morphology_score < 30) {
    morphology_roast = `${Math.round(abnormal_ratio)}% of your army looks like Picasso drew them drunk 🎨`;
  } else if (analysis.morphology_score < 50) {
    morphology_roast = `${Math.round(abnormal_ratio)}% look weird, but at least they're trying 🤷`;
  } else if (analysis.morphology_score < 70) {
    morphology_roast = "Some shape issues, but nothing a gym membership can't fix 💪";
  } else if (analysis.morphology_score < 85) {
    morphology_roast = "Pretty solid squad, mostly good-looking soldiers 🎖️";
  } else {
    morphology_roast = "Your sperm are Instagram models, all perfectly shaped ✨";
  }

  // Quantity Roast based on total_sperm
  let quantity_roast = "";
  if (analysis.total_sperm < 20) {
    quantity_roast = `Bro brought ${analysis.total_sperm} soldiers to a war 💀`;
  } else if (analysis.total_sperm < 50) {
    quantity_roast = `${analysis.total_sperm} troops? That's a small militia, not an army 🪖`;
  } else if (analysis.total_sperm < 80) {
    quantity_roast = `${analysis.total_sperm} swimmers - decent squad size 👥`;
  } else {
    quantity_roast = `${analysis.total_sperm} soldiers! You're single-handedly solving overpopulation 🌍`;
  }

  // Motility Roast (behavioral description)
  let motility_roast = "";
  if (analysis.motility_score < 30) {
    motility_roast = "They're not swimming, they're having an existential crisis 🤔";
  } else if (analysis.motility_score < 50) {
    motility_roast = "Most of them are just vibing, not really moving forward 🎵";
  } else if (analysis.motility_score < 70) {
    motility_roast = "Some are swimming, others are sightseeing 🏖️";
  } else if (analysis.motility_score < 85) {
    motility_roast = "Good hustle! Most are actively swimming 🏊";
  } else {
    motility_roast = "Your swimmers are Olympic athletes! 🥇";
  }

  // Overall Roast based on quality_score
  let overall_roast = "";
  if (analysis.quality_score < 20) {
    overall_roast = "Congrats! You're an extinction helper. Adoption is your friend. 🏴‍☠️";
  } else if (analysis.quality_score < 30) {
    overall_roast = "F in the chat. But hey, at least you tried? 🪦";
  } else if (analysis.quality_score < 40) {
    overall_roast = "Not great, not terrible. Like a 3.6 Roentgen situation. ☢️";
  } else if (analysis.quality_score < 50) {
    overall_roast = "Your sperm need a motivational speaker 📢";
  } else if (analysis.quality_score < 60) {
    overall_roast = "Mid tier. You're the human equivalent of a participation trophy 🏆";
  } else if (analysis.quality_score < 70) {
    overall_roast = "Not bad! Could be worse, could be better 🤷";
  } else if (analysis.quality_score < 80) {
    overall_roast = "Solid performance. You're doing alright, champ 💪";
  } else if (analysis.quality_score < 90) {
    overall_roast = "Strong game! Your swimmers are ready for battle 🔥";
  } else {
    overall_roast = "You're a fertility god. Go forth and multiply! 👑";
  }

  return {
    speed_roast,
    morphology_roast,
    quantity_roast,
    motility_roast,
    overall_roast,
  };
}

export function generateBadges(analysis: {
  quality_score: number;
  morphology_score: number;
  motility_score: number;
  total_sperm: number;
}): Badge[] {
  const badges: Badge[] = [];

  // Snail Pace Champion
  if (analysis.motility_score < 30) {
    badges.push({
      id: "snail_pace",
      emoji: "🐌",
      title: "Snail Pace Champion",
      desc: "Speed in bottom 30%",
    });
  }

  // Abstract Art Collector
  if (analysis.morphology_score < 40) {
    badges.push({
      id: "abstract_art",
      emoji: "🎨",
      title: "Abstract Art Collector",
      desc: "Morphology issues detected",
    });
  }

  // Population Control Activist
  if (analysis.quality_score < 30) {
    badges.push({
      id: "population_control",
      emoji: "💀",
      title: "Population Control Activist",
      desc: "Overall score < 30",
    });
  }

  // Against All Odds
  if (analysis.quality_score < 50 && analysis.motility_score > 70) {
    badges.push({
      id: "against_odds",
      emoji: "🏆",
      title: "Against All Odds",
      desc: "Low quality but high hustle",
    });
  }

  // Fertility Deity
  if (analysis.quality_score >= 90) {
    badges.push({
      id: "god_tier",
      emoji: "👑",
      title: "Fertility Deity",
      desc: "Top tier performance",
    });
  }

  // Ghost Town
  if (analysis.total_sperm < 20) {
    badges.push({
      id: "ghost_town",
      emoji: "👻",
      title: "Ghost Town",
      desc: "Very low sperm count",
    });
  }

  // Army General
  if (analysis.total_sperm > 100) {
    badges.push({
      id: "army_general",
      emoji: "⚔️",
      title: "Army General",
      desc: "Massive troop count",
    });
  }

  // Speed Demon
  if (analysis.motility_score >= 90) {
    badges.push({
      id: "speed_demon",
      emoji: "⚡",
      title: "Speed Demon",
      desc: "Elite velocity detected",
    });
  }

  return badges;
}

