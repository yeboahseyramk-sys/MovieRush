import mongoose from "mongoose";

const badgeDefs = ["First Watch", "Popcorn Fan", "Movie Buff", "Cinephile", "Movie Master"];

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    avatar: { type: String, default: "" },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    moviesWatched: { type: Number, default: 0 },
    badges: { type: [String], default: [] },
    claimedRewardBoxes: { type: [String], default: [] },
    watchlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie" }],
    lastActiveAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

userSchema.methods.toSafeObject = function () {
  return {
    id: this._id,
    username: this.username,
    email: this.email,
    avatar: this.avatar,
    role: this.role,
    moviesWatched: this.moviesWatched,
    badges: this.badges,
    claimedRewardBoxes: this.claimedRewardBoxes,
    createdAt: this.createdAt,
  };
};

export const BADGE_DEFS = badgeDefs;
export default mongoose.model("User", userSchema);
