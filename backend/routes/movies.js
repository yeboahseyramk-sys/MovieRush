import express from "express";
import Movie from "../models/Movie.js";
import Watched from "../models/Watched.js";
import User from "../models/User.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";
import { computeBadges } from "../utils/badges.js";

const router = express.Router();

// Public: list / search / filter movies
router.get("/", async (req, res) => {
  try {
    const { genre, search, trending } = req.query;
    const filter = {};
    if (genre && genre !== "Trending") filter.genre = genre;
    if (trending === "true") filter.trending = true;
    if (search) filter.title = { $regex: search, $options: "i" };

    const movies = await Movie.find(filter).sort({ createdAt: -1 });
    res.json(movies);
  } catch (err) {
    res.status(500).json({ message: "Failed to load movies", error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ message: "Movie not found" });
    res.json(movie);
  } catch (err) {
    res.status(500).json({ message: "Failed to load movie", error: err.message });
  }
});

// Mark a movie as watched, updates badge/reward progress
router.post("/:id/watch", requireAuth, async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ message: "Movie not found" });

    const already = await Watched.findOne({ user: req.user._id, movie: movie._id });
    if (!already) {
      await Watched.create({ user: req.user._id, movie: movie._id });
      movie.views += 1;
      await movie.save();

      req.user.moviesWatched += 1;
      req.user.badges = computeBadges(req.user.moviesWatched);
      await req.user.save();
    }

    res.json({ moviesWatched: req.user.moviesWatched, badges: req.user.badges });
  } catch (err) {
    res.status(500).json({ message: "Failed to record watch", error: err.message });
  }
});

// Watchlist
router.post("/:id/watchlist", requireAuth, async (req, res) => {
  const movie = await Movie.findById(req.params.id);
  if (!movie) return res.status(404).json({ message: "Movie not found" });

  const idx = req.user.watchlist.findIndex((m) => m.toString() === movie._id.toString());
  if (idx >= 0) req.user.watchlist.splice(idx, 1);
  else req.user.watchlist.push(movie._id);

  await req.user.save();
  res.json({ watchlist: req.user.watchlist });
});

router.get("/user/watchlist", requireAuth, async (req, res) => {
  const user = await User.findById(req.user._id).populate("watchlist");
  res.json(user.watchlist);
});

// Admin: create / update / delete movies
router.post("/", requireAuth, requireAdmin, async (req, res) => {
  try {
    const movie = await Movie.create(req.body);
    res.status(201).json(movie);
  } catch (err) {
    res.status(400).json({ message: "Failed to create movie", error: err.message });
  }
});

router.put("/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!movie) return res.status(404).json({ message: "Movie not found" });
    res.json(movie);
  } catch (err) {
    res.status(400).json({ message: "Failed to update movie", error: err.message });
  }
});

router.delete("/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    await Movie.findByIdAndDelete(req.params.id);
    res.json({ message: "Movie deleted" });
  } catch (err) {
    res.status(400).json({ message: "Failed to delete movie", error: err.message });
  }
});

export default router;
