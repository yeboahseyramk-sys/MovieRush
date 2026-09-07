import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, Gift, LogOut, Moon, Sun, ShieldCheck } from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { BadgeRow, RewardBoxGrid } from "../components/RewardBoxes";
import BottomNav from "../components/BottomNav";

export default function Profile() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);

  const loadProfile = async () => {
    const { data } = await api.get("/users/profile");
    setProfile(data);
  };

  useEffect(() => {
    loadProfile();
  }, []);

  if (!profile) return <div className="flex h-screen items-center justify-center bg-base text-white/50">Loading...</div>;

  return (
    <div className="min-h-screen bg-base pb-24 text-white">
      <div className="mx-auto max-w-md px-4 pt-6">
        <div className="flex flex-col items-center">
          <div className="relative">
            <img src={profile.avatar} alt="avatar" className="h-24 w-24 rounded-full border-4 border-surface2 object-cover" />
            <button className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-accent">
              <Camera size={14} />
            </button>
          </div>
          <h1 className="mt-3 text-lg font-bold">{profile.username}</h1>
          <p className="text-sm text-white/40">{profile.email}</p>
          <span className="mt-2 rounded-full bg-surface2 px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-white/60">
            {profile.role}
          </span>
          <p className="mt-2 text-sm text-white/50">{profile.moviesWatched} movies watched</p>
        </div>

        <div className="mt-6">
          <BadgeRow badges={profile.badges} />
        </div>

        <div className="mt-6">
          <div className="mb-3 flex items-center gap-2">
            <Gift size={16} className="text-accent" />
            <h2 className="text-base font-semibold">Reward Boxes</h2>
          </div>
          <RewardBoxGrid profile={profile} onClaim={loadProfile} />
        </div>

        <div className="mt-6 flex flex-col gap-2">
          {profile.role === "admin" && (
            <button
              onClick={() => navigate("/admin")}
              className="flex items-center justify-between rounded-xl2 bg-surface px-4 py-3 text-sm"
            >
              <span className="flex items-center gap-2"><ShieldCheck size={16} className="text-accent" /> Admin Dashboard</span>
            </button>
          )}
          <button onClick={toggleTheme} className="flex items-center justify-between rounded-xl2 bg-surface px-4 py-3 text-sm">
            <span className="flex items-center gap-2">
              {theme === "dark" ? <Moon size={16} /> : <Sun size={16} />} {theme === "dark" ? "Dark Mode" : "Light Mode"}
            </span>
          </button>
          <button
            onClick={() => { logout(); navigate("/login"); }}
            className="flex items-center justify-between rounded-xl2 bg-surface px-4 py-3 text-sm text-red-400"
          >
            <span className="flex items-center gap-2"><LogOut size={16} /> Log Out</span>
          </button>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
