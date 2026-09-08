import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Star } from "lucide-react";
import api from "../api/axios";
import BottomNav from "../components/BottomNav";

export default function Watchlist() {
  const [movies, setMovies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/movies/user/watchlist").then((res) => setMovies(res.data));
  }, []);

  return (
    <div className="min-h-screen relative z-10 pb-24 text-white">
      <div className="mx-auto max-w-md px-4 pt-6">
        <h1 className="text-lg font-bold">My Watchlist</h1>
        <p className="text-sm text-white/40">{movies.length} movies saved</p>

        <div className="mt-5 grid grid-cols-2 gap-4">
          {movies.map((m) => (
            <div key={m._id} onClick={() => navigate(`/movie/${m._id}`)} className="cursor-pointer">
              <div className="relative">
                <img
                  src={m.poster}
                  className="h-48 w-full rounded-xl2 object-cover"
                  onError={(e) => { e.target.src = "https://placehold.co/300x450/1A1530/7C5CFC?text=" + encodeURIComponent(m.title); }}
                />
                <div className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-black/50 px-2 py-0.5 text-xs">
                  <Star size={11} className="fill-yellow-400 text-yellow-400" /> {m.rating}
                </div>
              </div>
              <p className="mt-2 truncate text-sm font-medium">{m.title}</p>
              <p className="text-xs text-white/40">{m.year}</p>
            </div>
          ))}
        </div>

        {movies.length === 0 && (
          <div className="mt-16 flex flex-col items-center text-center text-white/30">
            <p className="text-sm">Your watchlist is empty.</p>
            <p className="text-xs">Save movies you want to watch later.</p>
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
}
