import mongoose from "mongoose";

const watchedSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    movie: { type: mongoose.Schema.Types.ObjectId, ref: "Movie", required: true },
    watchedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

watchedSchema.index({ user: 1, movie: 1 }, { unique: true });

export default mongoose.model("Watched", watchedSchema);
