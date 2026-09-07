import mongoose from "mongoose";

// One row per user per calendar day they were active - used to compute
// daily/weekly active users for the admin analytics dashboard.
const activityLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: String, required: true }, // YYYY-MM-DD
});

activityLogSchema.index({ user: 1, date: 1 }, { unique: true });

export default mongoose.model("ActivityLog", activityLogSchema);
