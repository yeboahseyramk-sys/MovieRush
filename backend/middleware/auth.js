import jwt from "jsonwebtoken";
import User from "../models/User.js";
import ActivityLog from "../models/ActivityLog.js";

export const requireAuth = async (req, res, next) => {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) return res.status(401).json({ message: "Not authenticated" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ message: "Not authenticated" });

    req.user = user;

    // Track activity for DAU analytics + lastActiveAt, fire-and-forget
    const today = new Date().toISOString().slice(0, 10);
    User.findByIdAndUpdate(user._id, { lastActiveAt: new Date() }).catch(() => {});
    ActivityLog.updateOne(
      { user: user._id, date: today },
      { $setOnInsert: { user: user._id, date: today } },
      { upsert: true }
    ).catch(() => {});

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export const requireAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};
