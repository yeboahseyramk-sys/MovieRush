import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import api from "../api/axios";
import { uploadToCloudinary, formatDuration } from "../api/cloudinary";

const GENRES = ["Action", "Comedy", "Sci-Fi", "Drama", "Horror", "Romance", "Thriller", "Animation"];

export default function AddMovieForm({ onAdded }) {
  const [form, setForm] = useState({ title: "", genre: GENRES[0], year: new Date().getFullYear() });
  const [videoFile, setVideoFile] = useState(null);
  const [posterFile, setPosterFile] = useState(null);
  const [progress, setProgress] = useState({ video: 0, poster: 0 });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (!videoFile) return setError("Select a video file");
    setError("");
    setSaving(true);
    try {
      const videoResult = await uploadToCloudinary(videoFile, "video", (pct) =>
        setProgress((p) => ({ ...p, video: pct }))
      );

      let posterUrl = `https://placehold.co/400x600/1A1530/7C5CFC?text=${encodeURIComponent(form.title)}`;
      if (posterFile) {
        const posterResult = await uploadToCloudinary(posterFile, "image", (pct) =>
          setProgress((p) => ({ ...p, poster: pct }))
        );
        posterUrl = posterResult.url;
      }

      await api.post("/movies", {
        title: form.title,
        genre: form.genre,
        year: Number(form.year),
        duration: formatDuration(videoResult.duration),
        poster: posterUrl,
        videoUrl: videoResult.url,
        rating: 0,
      });

      setForm({ title: "", genre: GENRES[0], year: new Date().getFullYear() });
      setVideoFile(null);
      setPosterFile(null);
      setProgress({ video: 0, poster: 0 });
      onAdded?.();
    } catch (err) {
      setError(err.message || "Upload failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="rounded-xl2 bg-surface p-4">
      <div className="mb-3 flex items-center gap-2">
        <Plus size={16} className="text-accent" />
        <h3 className="text-sm font-semibold">Add a Single Movie</h3>
      </div>

      <div className="flex flex-col gap-2.5">
        <input
          required
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          disabled={saving}
          className="rounded-lg bg-surface2 px-3 py-2 text-sm outline-none"
        />
        <div className="flex gap-2">
          <select
            value={form.genre}
            onChange={(e) => setForm({ ...form, genre: e.target.value })}
            disabled={saving}
            className="flex-1 rounded-lg bg-surface2 px-3 py-2 text-sm outline-none"
          >
            {GENRES.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
          <input
            type="number"
            value={form.year}
            onChange={(e) => setForm({ ...form, year: e.target.value })}
            disabled={saving}
            className="w-24 rounded-lg bg-surface2 px-3 py-2 text-sm outline-none"
          />
        </div>

        <label className="flex cursor-pointer items-center justify-between rounded-lg bg-surface2 px-3 py-2 text-sm text-white/60">
          {videoFile ? videoFile.name : "Choose video file"}
          <input
            type="file"
            accept="video/*"
            className="hidden"
            disabled={saving}
            onChange={(e) => setVideoFile(e.target.files[0] || null)}
          />
        </label>
        {saving && videoFile && (
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${progress.video}%` }} />
          </div>
        )}

        <label className="flex cursor-pointer items-center justify-between rounded-lg bg-surface2 px-3 py-2 text-sm text-white/60">
          {posterFile ? posterFile.name : "Choose poster image (optional)"}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            disabled={saving}
            onChange={(e) => setPosterFile(e.target.files[0] || null)}
          />
        </label>
        {saving && posterFile && (
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${progress.poster}%` }} />
          </div>
        )}

        {error && <p className="text-xs text-red-400">{error}</p>}

        <button
          disabled={saving}
          className="mt-1 flex items-center justify-center gap-2 rounded-xl2 bg-gradient-to-r from-accent to-accent-pink py-2.5 text-sm font-semibold disabled:opacity-60"
        >
          {saving ? <><Loader2 size={15} className="animate-spin" /> Uploading...</> : "Add Movie"}
        </button>
      </div>
    </form>
  );
}
