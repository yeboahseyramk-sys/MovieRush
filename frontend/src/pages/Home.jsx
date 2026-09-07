import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Bell, SlidersHorizontal, Play, Star, Sparkles } from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import MovieCard from "../components/MovieCard";
import BottomNav from "../components/BottomNav";

const categories = ["Trending", "Action", "Comedy", "Sci-Fi", "Drama"];

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [category, setCategory] = useState("Trending");
  const [search, setSearch] = useState("");
  const [heroIndex, setHeroIndex] = useState(0);
  const [watchlist, setWatchlist] = useState([]);

  const loadMovies = async () => {
    const params = {};
    if (category === "Trending") params.trending = "true";
    else params.genre = category;
    if (search) params.search = search;
    const { data } = await api.get("/movies", { params });
    setMovies(data);
  };

  const loadWatchlist = async () => {
    try {
      const { data } = await api.get("/movies/user/watchlist");
      setWatchlist(data.map((m) => m._id));
    } catch {}
  };

  useEffect(() => {
    loadMovies();
  }, [category, search]);

  useEffect(() => {
    loadWatchlist();
  }, []);

  useEffect(() => {
    if (movies.length < 2) return;
    const t = setInterval(() => setHeroIndex((i) => (i + 1) % Math.min(movies.length, 5)), 5000);
    return () => clearInterval(t);
  }, [movies]);

  const toggleWatchlist = async (id) => {
    await api.post(`/movies/${id}/watchlist`);
    setWatchlist((w) => (w.includes(id) ? w.filter((x) => x !== id) : [...w, id]));
  };

  const hero = movies[heroIndex];
  const recent = [...movies].slice(0, 6);

  return (
    <div className="min-h-screen bg-base pb-24 text-white">
      <div className="mx-auto max-w-md px-4 pt-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-white/40">Welcome back</p>
            <h1 className="text-lg font-bold">
              Movie<span className="text-accent">Rush</span>
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-1 rounded-full bg-gradient-to-r from-accent to-accent-pink px-3 py-1.5 text-xs font-medium">
              <Sparkles size={13} /> Surprise Me
            </button>
            <button className="relative">
              <Bell size={20} className="text-white/70" />
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px]">
                2
              </span>
            </button>
            <button onClick={() => navigate("/profile")}>
              <img
                src={user?.avatar}
                alt="avatar"
                className="h-8 w-8 rounded-full border-2 border-accent object-cover"
              />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="mt-4 flex items-center gap-2">
          <div className="flex flex-1 items-center gap-2 rounded-xl2 bg-surface px-4 py-3">
            <Search size={16} className="text-white/40" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search movies..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-white/30"
            />
          </div>
          <button className="flex h-11 w-11 items-center justify-center rounded-xl2 bg-surface">
            <SlidersHorizontal size={16} className="text-white/60" />
          </button>
        </div>

        {/* Categories */}
        <div className="mt-4 flex gap-2 overflow-x-auto scrollbar-none">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition ${
                category === c ? "bg-accent text-white" : "bg-surface text-white/50"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Hero */}
        {hero && (
          <div
            onClick={() => navigate(`/movie/${hero._id}`)}
            className="relative mt-5 h-56 cursor-pointer overflow-hidden rounded-xl2"
          >
            <img
              src={hero.backdrop || hero.poster}
              alt={hero.title}
              className="h-full w-full object-cover"
              onError={(e) => { e.target.src = "https://placehold.co/500x300/1A1530/7C5CFC?text=" + encodeURIComponent(hero.title); }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
            <div className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
              <Play size={22} className="fill-white text-white" />
            </div>
            <div className="absolute bottom-3 left-3 right-3">
              <div className="mb-1 flex items-center gap-2">
                <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-semibold">{hero.genre}</span>
                <span className="text-[11px] text-white/70">{hero.duration}</span>
                <span className="flex items-center gap-0.5 text-[11px] text-yellow-400">
                  <Star size={10} className="fill-yellow-400" /> {hero.rating}
                </span>
              </div>
              <p className="text-base font-semibold">{hero.title}</p>
            </div>
          </div>
        )}

        {movies.length > 1 && (
          <div className="mt-2 flex justify-center gap-1.5">
            {movies.slice(0, 5).map((_, i) => (
              <div key={i} className={`h-1.5 rounded-full transition-all ${i === heroIndex ? "w-4 bg-accent" : "w-1.5 bg-white/20"}`} />
            ))}
          </div>
        )}

        {/* Recently Added */}
        <div className="mt-6">
          <div className="mb-3 flex items-center gap-2">
            <span className="rounded bg-accent px-1.5 py-0.5 text-[9px] font-bold">NEW</span>
            <h2 className="text-base font-semibold">Recently Added</h2>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
            {recent.map((m) => (
              <MovieCard key={m._id} movie={m} onToggleWatchlist={toggleWatchlist} isSaved={watchlist.includes(m._id)} />
            ))}
            {recent.length === 0 && <p className="text-sm text-white/30">No movies yet.</p>}
          </div>
        </div>

        {/* For You */}
        <div className="mt-6">
          <h2 className="mb-3 text-base font-semibold">For You</h2>
          <div className="grid grid-cols-3 gap-3">
            {movies.slice(0, 9).map((m) => (
              <img
                key={m._id}
                src={m.poster}
                onClick={() => navigate(`/movie/${m._id}`)}
                className="h-36 w-full cursor-pointer rounded-lg object-cover"
                onError={(e) => { e.target.src = "https://placehold.co/200x300/1A1530/7C5CFC?text=" + encodeURIComponent(m.title); }}
              />
            ))}
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
