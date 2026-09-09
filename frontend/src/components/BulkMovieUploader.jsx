import { useState } from "react";
import { UploadCloud, Film, Trash2, Loader2, CheckCircle2 } from "lucide-react";
import api from "../api/axios";
import { uploadToCloudinary, formatDuration } from "../api/cloudinary";

const GENRES = ["Action", "Comedy", "Sci-Fi", "Drama", "Horror", "Romance", "Thriller", "Animation"];

// Turns "The.Witch.Part.2.2022.mp4" into "The Witch Part 2 2022"
function titleFromFilename(name) {
  return name
    .replace(/\.[^/.]+$/, "")
    .replace(/[._]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export default function BulkMovieUploader({ onDone }) {
  const [rows, setRows] = useState([]); // { id, videoFile, posterFile, title, genre, year, videoProgress, posterProgress, status }
  const [saving, setSaving] = useState(false);
  const [savedCount, setSavedCount] = useState(0);

  const handleVideoFiles = (fileList) => {
    const files = Array.from(fileList);
    const newRows = files.map((file) => ({
      id: `${file.name}-${file.size}-${Math.random().toString(36).slice(2)}`,
      videoFile: file,
      posterFile: null,
      title: titleFromFilename(file.name),
      genre: GENRES[0],
      year: new Date().getFullYear(),
      videoProgress: 0,
      posterProgress: 0,
      status: "pending", // pending | uploading | done | error
      error: null,
    }));
    setRows((r) => [...r, ...newRows]);
  };

  const updateRow = (id, patch) => {
    setRows((r) => r.map((row) => (row.id === id ? { ...row, ...patch } : row)));
  };

  const removeRow = (id) => setRows((r) => r.filter((row) => row.id !== id));

  const attachPoster = (id, file) => updateRow(id, { posterFile: file });

  const uploadAll = async () => {
    if (rows.length === 0) return;
    setSaving(true);
    setSavedCount(0);
    const results = [];

    for (const row of rows) {
      try {
        updateRow(row.id, { status: "uploading" });

        const videoResult = await uploadToCloudinary(row.videoFile, "video", (pct) =>
          updateRow(row.id, { videoProgress: pct })
        );

        let posterUrl = "";
        if (row.posterFile) {
          const posterResult = await uploadToCloudinary(row.posterFile, "image", (pct) =>
            updateRow(row.id, { posterProgress: pct })
          );
          posterUrl = posterResult.url;
        } else {
          // Fallback placeholder poster if none was provided
          posterUrl = `https://placehold.co/400x600/1A1530/7C5CFC?text=${encodeURIComponent(row.title)}`;
        }

        results.push({
          title: row.title,
          genre: row.genre,
          year: Number(row.year),
          duration: formatDuration(videoResult.duration),
          poster: posterUrl,
          videoUrl: videoResult.url,
          rating: 0,
        });

        updateRow(row.id, { status: "done" });
        setSavedCount((c) => c + 1);
      } catch (err) {
        updateRow(row.id, { status: "error", error: err.message });
      }
    }

    if (results.length > 0) {
      try {
        await api.post("/movies/bulk", { movies: results });
      } catch (err) {
        // individual row statuses already reflect upload success; a bulk
        // save failure here is surfaced generically
        alert("Movies uploaded but saving to the catalog failed: " + err.message);
      }
    }

    setSaving(false);
    onDone?.();
  };

  return (
    <div className="rounded-xl2 bg-surface p-4">
      <div className="mb-3 flex items-center gap-2">
        <UploadCloud size={16} className="text-accent" />
        <h3 className="text-sm font-semibold">Bulk Upload Movies</h3>
      </div>
      <p className="mb-4 text-xs text-white/40">
        Select multiple video files at once. Titles are auto-filled from the filename — adjust genre/year/title, then upload everything in one go.
      </p>

      <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl2 border-2 border-dashed border-white/15 py-8 text-center hover:border-accent/50">
        <UploadCloud size={24} className="text-white/40" />
        <span className="text-sm text-white/60">Click to select video files (multiple allowed)</span>
        <input
          type="file"
          accept="video/*"
          multiple
          className="hidden"
          onChange={(e) => e.target.files.length && handleVideoFiles(e.target.files)}
        />
      </label>

      {rows.length > 0 && (
        <div className="mt-4 flex flex-col gap-3">
          {rows.map((row) => (
            <div key={row.id} className="rounded-xl2 bg-surface2 p-3">
              <div className="flex items-start gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-black/30">
                  <Film size={18} className="text-white/40" />
                </div>
                <div className="flex-1 min-w-0">
                  <input
                    value={row.title}
                    onChange={(e) => updateRow(row.id, { title: e.target.value })}
                    disabled={saving}
                    className="w-full rounded-lg bg-black/20 px-2 py-1.5 text-sm outline-none"
                    placeholder="Title"
                  />
                  <div className="mt-2 flex flex-wrap gap-2">
                    <select
                      value={row.genre}
                      onChange={(e) => updateRow(row.id, { genre: e.target.value })}
                      disabled={saving}
                      className="rounded-lg bg-black/20 px-2 py-1 text-xs outline-none"
                    >
                      {GENRES.map((g) => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                    <input
                      type="number"
                      value={row.year}
                      onChange={(e) => updateRow(row.id, { year: e.target.value })}
                      disabled={saving}
                      className="w-20 rounded-lg bg-black/20 px-2 py-1 text-xs outline-none"
                      placeholder="Year"
                    />
                    <label className="cursor-pointer rounded-lg bg-black/20 px-2 py-1 text-xs text-white/50 hover:text-white/80">
                      {row.posterFile ? "Poster ✓" : "+ Poster image"}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        disabled={saving}
                        onChange={(e) => e.target.files[0] && attachPoster(row.id, e.target.files[0])}
                      />
                    </label>
                  </div>
                  <p className="mt-1 truncate text-[10px] text-white/30">{row.videoFile.name}</p>

                  {row.status === "uploading" && (
                    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-accent transition-all"
                        style={{ width: `${row.videoProgress}%` }}
                      />
                    </div>
                  )}
                  {row.status === "error" && (
                    <p className="mt-1 text-[10px] text-red-400">{row.error}</p>
                  )}
                </div>

                <div className="shrink-0">
                  {row.status === "done" ? (
                    <CheckCircle2 size={18} className="text-green-400" />
                  ) : row.status === "uploading" ? (
                    <Loader2 size={18} className="animate-spin text-accent" />
                  ) : (
                    <button onClick={() => removeRow(row.id)} disabled={saving}>
                      <Trash2 size={16} className="text-white/30 hover:text-red-400" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={uploadAll}
            disabled={saving}
            className="mt-1 flex items-center justify-center gap-2 rounded-xl2 bg-gradient-to-r from-accent to-accent-pink py-3 text-sm font-semibold disabled:opacity-60"
          >
            {saving ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Uploading {savedCount}/{rows.length}...
              </>
            ) : (
              `Upload All ${rows.length} Movies`
            )}
          </button>
        </div>
      )}
    </div>
  );
}
