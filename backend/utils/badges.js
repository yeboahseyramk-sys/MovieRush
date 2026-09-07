// Badge + reward box thresholds, shared source of truth for backend logic
// (kept in sync with the frontend display components).

export const BADGES = [
  { name: "First Watch", threshold: 1, icon: "clapperboard" },
  { name: "Popcorn Fan", threshold: 5, icon: "popcorn" },
  { name: "Movie Buff", threshold: 15, icon: "star" },
  { name: "Cinephile", threshold: 30, icon: "trophy" },
  { name: "Movie Master", threshold: 50, icon: "crown" },
];

export const REWARD_BOXES = [
  { name: "Welcome Gift", threshold: 1 },
  { name: "Popcorn Lover Box", threshold: 5 },
  { name: "Movie Buff Crate", threshold: 15 },
  { name: "Cinephile Vault", threshold: 30 },
  { name: "Golden VIP Box", threshold: 50 },
];

export function computeBadges(moviesWatched) {
  return BADGES.filter((b) => moviesWatched >= b.threshold).map((b) => b.name);
}

export function nextRewardBox(moviesWatched, claimed = []) {
  return REWARD_BOXES.find(
    (b) => moviesWatched < b.threshold || !claimed.includes(b.name)
  );
}
