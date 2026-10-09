import { categories, experiences, type CategoryId } from "./experiences";

export type Level = {
  min: number;
  max: number;
  name: string;
  emoji: string;
  blurb: string;
};

export const levels: Level[] = [
  { min: 0, max: 20, name: "Bangladesh Beginner", emoji: "🌱", blurb: "Your Bangladesh story is just beginning." },
  { min: 21, max: 40, name: "Deshi Explorer", emoji: "🧭", blurb: "You've seen enough to have opinions." },
  { min: 41, max: 60, name: "Bangladesh Regular", emoji: "🛺", blurb: "You know the chaos, and the chaos knows you." },
  { min: 61, max: 75, name: "Top-Tier Explorer", emoji: "🔥", blurb: "Bangladesh has been seriously explored." },
  { min: 76, max: 90, name: "Bangladesh Legend", emoji: "🏆", blurb: "Stories from every corner. Respect." },
  { min: 91, max: 100, name: "Certified Bangladesh Icon", emoji: "👑", blurb: "There is nothing left to flex. You did it all." },
];

export function getLevel(score: number): Level {
  const s = Math.max(0, Math.min(100, Math.round(score)));
  return levels.find((l) => s >= l.min && s <= l.max) ?? levels[0];
}

const totalPoints = experiences.reduce((sum, e) => sum + e.points, 0);

export type CategoryBreakdown = {
  id: CategoryId;
  label: string;
  icon: string;
  count: number;
  total: number;
};

export type Result = {
  score: number;
  level: Level;
  count: number;
  totalExperiences: number;
  breakdown: CategoryBreakdown[];
  topCategory: CategoryBreakdown | null;
  funLine: string;
  selectedIds: string[];
};

// Funny "most deshi thing about you" line, based on your strongest category
const funLines: Record<CategoryId, string> = {
  travel: "You treat every long weekend as a reason to pack a bag.",
  food: "You're somehow always ready for food.",
  adventure: "You say 'just one more stop' and mean three.",
  city: "You can read Dhaka traffic like a weather forecast.",
  culture: "Every family event has your name on the guest list.",
  everyday: "You've mastered the small things only we understand.",
};

const emptyLine = "Everyone starts somewhere. Time to go make some stories.";

export function calculateResult(selectedIds: string[]): Result {
  const picked = new Set(selectedIds);
  const chosen = experiences.filter((e) => picked.has(e.id));

  const earned = chosen.reduce((sum, e) => sum + e.points, 0);
  const score = Math.round((earned / totalPoints) * 100);

  const breakdown: CategoryBreakdown[] = categories.map((c) => {
    const all = experiences.filter((e) => e.category === c.id);
    const mine = all.filter((e) => picked.has(e.id));
    return {
      id: c.id,
      label: c.label,
      icon: c.icon,
      count: mine.length,
      total: all.length,
    };
  });

  // Strongest category = highest share completed (ties go to the first one)
  let topCategory: CategoryBreakdown | null = null;
  let bestRatio = 0;
  for (const b of breakdown) {
    const ratio = b.count / b.total;
    if (ratio > bestRatio) {
      bestRatio = ratio;
      topCategory = b;
    }
  }

  return {
    score,
    level: getLevel(score),
    count: chosen.length,
    totalExperiences: experiences.length,
    breakdown,
    topCategory,
    funLine: topCategory ? funLines[topCategory.id] : emptyLine,
    selectedIds: chosen.map((e) => e.id),
  };
}