import express from "express";
import { requireAuth } from "../middleware/auth.js";
import { REWARD_BOXES } from "../utils/badges.js";
import User from "../models/User.js";

const router = express.Router();

router.get("/profile", requireAuth, async (req, res) => {
  const user = req.user;
  const nextBox = REWARD_BOXES.find((b) => !user.claimedRewardBoxes.includes(b.name));
  res.json({
    ...user.toSafeObject(),
    rewardBoxes: REWARD_BOXES.map((b) => ({
      ...b,
      unlocked: user.moviesWatched >= b.threshold,
      claimed: user.claimedRewardBoxes.includes(b.name),
    })),
    nextBox: nextBox
      ? { name: nextBox.name, threshold: nextBox.threshold, progress: user.moviesWatched }
      : null,
  });
});

router.post("/reward-boxes/:name/claim", requireAuth, async (req, res) => {
  const { name } = req.params;
  const box = REWARD_BOXES.find((b) => b.name === name);
  if (!box) return res.status(404).json({ message: "Reward box not found" });
  if (req.user.moviesWatched < box.threshold) {
    return res.status(400).json({ message: "Not unlocked yet" });
  }
  if (!req.user.claimedRewardBoxes.includes(name)) {
    req.user.claimedRewardBoxes.push(name);
    await req.user.save();
  }
  res.json({ claimedRewardBoxes: req.user.claimedRewardBoxes });
});

router.put("/avatar", requireAuth, async (req, res) => {
  const { avatar } = req.body;
  req.user.avatar = avatar;
  await req.user.save();
  res.json({ avatar: req.user.avatar });
});

export default router;
