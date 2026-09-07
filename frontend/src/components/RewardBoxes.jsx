import { Gift, Lock, Sparkles } from "lucide-react";
import api from "../api/axios";

const badgeIcons = {
  "First Watch": "🎬",
  "Popcorn Fan": "🍿",
  "Movie Buff": "⭐",
  "Cinephile": "🏆",
  "Movie Master": "👑",
};

export function BadgeRow({ badges = [] }) {
  const all = Object.keys(badgeIcons);
  return (
    <div className="flex justify-between px-2">
      {all.map((name) => {
        const earned = badges.includes(name);
        return (
          <div key={name} className="flex flex-col items-center gap-1.5">
            <div
              className={`flex h-14 w-14 items-center justify-center rounded-full text-2xl ${
                earned ? "bg-gradient-to-br from-accent to-accent-pink" : "bg-surface2 grayscale opacity-40"
              }`}
            >
              {badgeIcons[name]}
            </div>
            <span className="max-w-[60px] text-center text-[10px] text-white/60">{name}</span>
          </div>
        );
      })}
    </div>
  );
}

export function RewardBoxGrid({ profile, onClaim }) {
  const boxes = profile?.rewardBoxes || [];
  const nextBox = profile?.nextBox;

  const claim = async (name) => {
    await api.post(`/users/reward-boxes/${encodeURIComponent(name)}/claim`);
    onClaim?.();
  };

  return (
    <div>
      {nextBox && (
        <div className="mb-4 rounded-xl2 bg-surface2 p-4">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="flex items-center gap-1.5 font-medium">
              <Sparkles size={15} className="text-accent" /> Next: {nextBox.name}
            </span>
            <span className="text-accent">{Math.min(nextBox.progress, nextBox.threshold)}/{nextBox.threshold}</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-accent to-accent-pink transition-all"
              style={{ width: `${Math.min(100, (nextBox.progress / nextBox.threshold) * 100)}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-white/50">
            Watch {Math.max(0, nextBox.threshold - nextBox.progress)} more movies to unlock this gift box!
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        {boxes.map((box) => (
          <button
            key={box.name}
            disabled={!box.unlocked || box.claimed}
            onClick={() => claim(box.name)}
            className={`rounded-xl2 p-4 text-left transition ${
              box.unlocked ? "bg-surface2" : "bg-surface2/50"
            }`}
          >
            <div
              className={`mb-2 flex h-9 w-9 items-center justify-center rounded-full ${
                box.unlocked ? "bg-accent/20 text-accent" : "bg-white/5 text-white/30"
              }`}
            >
              {box.unlocked ? <Gift size={16} /> : <Lock size={16} />}
            </div>
            <p className="text-sm font-medium">{box.name}</p>
            <p className="text-xs text-white/40">{box.threshold} movies</p>
            {box.claimed && <p className="mt-1 text-[10px] font-medium text-accent">Claimed</p>}
            {box.unlocked && !box.claimed && <p className="mt-1 text-[10px] font-medium text-green-400">Tap to claim</p>}
          </button>
        ))}
      </div>
    </div>
  );
}
