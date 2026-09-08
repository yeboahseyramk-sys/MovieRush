import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, Play, Star, Eye, Download, Bookmark, QrCode } from "lucide-react";
import api from "../api/axios";

export default function MovieDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [saved, setSaved] = useState(false);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    api.get(`/movies/${id}`).then((res) => setMovie(res.data));
  }, [id]);

  const markWatched = async () => {
    await api.post(`/movies/${id}/watch`);
  };

  const toggleWatchlist = async () => {
    await api.post(`/movies/${id}/watchlist`);
    setSaved((s) => !s);
  };

  if (!movie) return <div className="flex h-screen items-center justify-center text-white/50 relative z-10">Loading...</div>;

  return (
    <div className="min-h-screen relative z-10 pb-10 text-white">
      <div className="mx-auto max-w-md px-4 pt-6">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="flex h-9 w-9 items-center justify-center rounded-full bg-surface">
            <ArrowLeft size={18} />
          </button>
          <button onClick={() => setLiked((l) => !l)} className="flex h-9 w-9 items-center justify-center rounded-full bg-surface">
            <Heart size={18} className={liked ? "fill-accent-pink text-accent-pink" : ""} />
          </button>
        </div>

        <div
          onClick={markWatched}
          className="relative mt-4 flex h-52 cursor-pointer items-center justify-center overflow-hidden rounded-xl2 bg-black"
        >
          <img src={movie.backdrop || movie.poster} alt={movie.title} className="absolute inset-0 h-full w-full object-cover opacity-70" />
          <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-accent">
            <Play size={22} className="fill-white text-white" />
          </div>
        </div>

        <h1 className="mt-4 text-xl font-bold">{movie.title}</h1>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-white/50">
          <span>{movie.duration}</span>
          <span>{movie.year}</span>
          <span className="rounded-full bg-surface2 px-2 py-0.5">{movie.genre}</span>
        </div>

        <div className="mt-4 grid grid-cols-4 gap-2">
          {[
            { label: "Rating", value: movie.rating, icon: Star },
            { label: "Score", value: `${movie.rating}/10`, icon: Star },
            { label: "Views", value: movie.views, icon: Eye },
            { label: "Likes", value: movie.likes ?? "-", icon: Heart },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="flex flex-col items-center gap-1 rounded-xl2 bg-surface py-3">
              <Icon size={14} className="text-accent" />
              <span className="text-sm font-semibold">{value}</span>
              <span className="text-[10px] text-white/40">{label}</span>
            </div>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <a
            href={movie.videoUrl || "#"}
            onClick={markWatched}
            className="flex items-center justify-center gap-2 rounded-xl2 bg-surface py-3 text-sm font-medium"
          >
            <Download size={16} /> Download
          </a>
          <button
            onClick={toggleWatchlist}
            className="flex items-center justify-center gap-2 rounded-xl2 bg-surface py-3 text-sm font-medium"
          >
            <Bookmark size={16} className={saved ? "fill-accent text-accent" : ""} /> Watchlist
          </button>
        </div>

        <button className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl2 bg-surface py-3 text-sm font-medium">
          <QrCode size={16} /> Share via QR
        </button>

        {movie.description && (
          <div className="mt-5">
            <h3 className="mb-1 text-sm font-semibold">Synopsis</h3>
            <p className="text-sm leading-relaxed text-white/60">{movie.description}</p>
          </div>
        )}
      </div>
    </div>
  );
}
