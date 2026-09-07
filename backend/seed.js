import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "./models/User.js";
import Movie from "./models/Movie.js";

dotenv.config();

const movies = [
  { title: "The Witch: Part 2. The Other One", genre: "Action", year: 2022, duration: "137 min", rating: 8.1, trending: true, poster: "https://image.tmdb.org/t/p/w500/2S3o9dq8kW2WD4c7Ok5o1AbCdEf.jpg", description: "A mysterious force awakens in a small town." },
  { title: "The Witch: Part 1. The Subversion", genre: "Action", year: 2018, duration: "126 min", rating: 8.1, trending: true, poster: "https://image.tmdb.org/t/p/w500/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg", description: "A girl escapes a secret lab and uncovers her true power." },
  { title: "Beasts of No Nation", genre: "Drama", year: 2015, duration: "137 min", rating: 8.2, trending: true, poster: "https://image.tmdb.org/t/p/w500/gPbM0MyDdehDCEpjMYlL9wa1zei.jpg", description: "A child soldier's harrowing journey during civil war." },
  { title: "The Marvels", genre: "Sci-Fi", year: 2023, duration: "105 min", rating: 7.8, poster: "https://image.tmdb.org/t/p/w500/9GBhzXMFjgcZ3FdR9w3bUMMTps5.jpg", description: "Three heroes team up to save the universe." },
  { title: "Head Of State", genre: "Comedy", year: 2025, duration: "1h 53min", rating: 8.6, poster: "https://image.tmdb.org/t/p/w500/placeholder1.jpg", description: "A political comedy about an unlikely leader." },
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected. Seeding...");

  await Movie.deleteMany({});
  await Movie.insertMany(movies);
  console.log(`Inserted ${movies.length} movies.`);

  const adminEmail = "admin@movierush.com";
  const existingAdmin = await User.findOne({ email: adminEmail });
  if (!existingAdmin) {
    const hashed = await bcrypt.hash("Admin123!", 10);
    await User.create({
      username: "admin",
      email: adminEmail,
      password: hashed,
      role: "admin",
      avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=admin",
    });
    console.log(`Created admin user -> ${adminEmail} / Admin123!`);
  } else {
    console.log("Admin user already exists.");
  }

  console.log("Seeding complete.");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
