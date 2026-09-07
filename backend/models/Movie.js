import mongoose from "mongoose";

const movieSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    poster: { type: String, required: true },
    backdrop: { type: String, default: "" },
    genre: { type: String, required: true },
    year: { type: Number, required: true },
    duration: { type: String, default: "" },
    rating: { type: Number, default: 0 },
    description: { type: String, default: "" },
    videoUrl: { type: String, default: "" },
    trending: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Movie", movieSchema);
