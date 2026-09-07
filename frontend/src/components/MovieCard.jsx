import { useNavigate } from "react-router-dom";
import { Heart, Star } from "lucide-react";

export default function MovieCard({ movie, onToggleWatchlist, isSaved }) {
  const navigate = useNavigate();
  return (
    <div className="w-36 shrink-0 cursor-pointer" onClick={() => navigate(`/movie/${movie._id}`)}>
      <div className="relative">
        <img
          src={movie.poster}
          alt={movie.title}
          className="h-52 w-36 rounded-xl2 object-cover"
          onError={(e) => { e.target.src = "https://placehold.co/300x450/1A1530/7C5CFC?text=" + encodeURIComponent(movie.title); }}
        />
        <button
          onClick={(e) => { e.stopPropagation(); onToggleWatchlist?.(movie._id); }}
          className="absolute left-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm"
        >
          <Heart size={14} className={isSaved ? "fill-accent-pink text-accent-pink" : "text-white"} />
        </button>
        <div className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-black/50 px-2 py-0.5 text-xs backdrop-blur-sm">
          <Star size={11} className="fill-yellow-400 text-yellow-400" />
          {movie.rating}
        </div>
      </div>
      <p className="mt-2 truncate text-sm font-medium">{movie.title}</p>
      <p className="text-xs text-white/40">{movie.year}</p>
    </div>
  );
}
