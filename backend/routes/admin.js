import express from "express";
import User from "../models/User.js";
import Movie from "../models/Movie.js";
import Watched from "../models/Watched.js";
import ActivityLog from "../models/ActivityLog.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

const router = express.Router();
router.use(requireAuth, requireAdmin);

function daysAgoISO(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

// High level stat cards: total users, active today, active 7d, total movies, total watches
router.get("/stats", async (req, res) => {
  try {
    const today = daysAgoISO(0);
    const sevenDaysAgo = daysAgoISO(7);
    const thirtyDaysAgo = daysAgoISO(30);

    const [totalUsers, activeToday, activeThisWeek, activeThisMonth, totalMovies, totalWatches, newUsersThisWeek] =
      await Promise.all([
        User.countDocuments(),
        ActivityLog.countDocuments({ date: today }),
        ActivityLog.distinct("user", { date: { $gte: sevenDaysAgo } }).then((a) => a.length),
        ActivityLog.distinct("user", { date: { $gte: thirtyDaysAgo } }).then((a) => a.length),
        Movie.countDocuments(),
        Watched.countDocuments(),
        User.countDocuments({ createdAt: { $gte: new Date(Date.now() - 7 * 86400000) } }),
      ]);

    res.json({
      totalUsers,
      activeToday,
      activeThisWeek,
      activeThisMonth,
      totalMovies,
      totalWatches,
      newUsersThisWeek,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to load stats", error: err.message });
  }
});

// Signups per day, last 14 days - for a line chart
router.get("/analytics/signups", async (req, res) => {
  try {
    const since = new Date();
    since.setDate(since.getDate() - 13);
    since.setHours(0, 0, 0, 0);

    const users = await User.find({ createdAt: { $gte: since } }, "createdAt");
    const buckets = {};
    for (let i = 0; i < 14; i++) {
      buckets[daysAgoISO(13 - i)] = 0;
    }
    users.forEach((u) => {
      const key = u.createdAt.toISOString().slice(0, 10);
      if (key in buckets) buckets[key] += 1;
    });

    res.json(Object.entries(buckets).map(([date, count]) => ({ date, count })));
  } catch (err) {
    res.status(500).json({ message: "Failed to load signup analytics", error: err.message });
  }
});

// Active users per day, last 14 days - for a line chart
router.get("/analytics/active-users", async (req, res) => {
  try {
    const dates = Array.from({ length: 14 }, (_, i) => daysAgoISO(13 - i));
    const logs = await ActivityLog.aggregate([
      { $match: { date: { $in: dates } } },
      { $group: { _id: "$date", count: { $sum: 1 } } },
    ]);
    const map = Object.fromEntries(logs.map((l) => [l._id, l.count]));
    res.json(dates.map((date) => ({ date, count: map[date] || 0 })));
  } catch (err) {
    res.status(500).json({ message: "Failed to load activity analytics", error: err.message });
  }
});

// Most-watched movies
router.get("/analytics/top-movies", async (req, res) => {
  try {
    const movies = await Movie.find().sort({ views: -1 }).limit(5);
    res.json(movies);
  } catch (err) {
    res.status(500).json({ message: "Failed to load top movies", error: err.message });
  }
});

// User list with pagination + search
router.get("/users", async (req, res) => {
  try {
    const { search = "", page = 1, limit = 20 } = req.query;
    const filter = search
      ? { $or: [{ username: { $regex: search, $options: "i" } }, { email: { $regex: search, $options: "i" } }] }
      : {};

    const users = await User.find(filter)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await User.countDocuments(filter);
    res.json({ users, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: "Failed to load users", error: err.message });
  }
});

router.patch("/users/:id/role", async (req, res) => {
  try {
    const { role } = req.body;
    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Failed to update role", error: err.message });
  }
});

router.delete("/users/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete user", error: err.message });
  }
});

export default router;
