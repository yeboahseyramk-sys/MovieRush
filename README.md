# MovieRush 🎬

A full-stack movie streaming catalog app with gamification and an admin analytics dashboard.

**Stack:** React (Vite) + Tailwind CSS · Node.js/Express · MongoDB (Mongoose) · JWT auth

## Features

**For users**
- Browse trending movies, filter by genre, search
- Movie detail pages with watch tracking, watchlist, and share
- Badges (First Watch → Movie Master) and reward boxes that unlock as you watch more movies
- Profile with dark/light mode

**For admins**
- Dashboard with total users, active users (today / 7-day / 30-day), total movies, total watches
- Signups-over-time and active-users-over-time charts
- Most-watched movies leaderboard
- Searchable user list — promote/demote admins, delete users

The first account ever registered on a fresh database automatically becomes an admin.

## Project structure

```
movierush/
├── frontend/          # React app (Vite)
│   └── src/
│       ├── pages/      # Home, MovieDetail, Watchlist, Downloads, Profile, Admin, Login, Register
│       ├── components/ # MovieCard, BottomNav, RewardBoxes, route guards
│       ├── context/    # Auth + theme context
│       └── api/        # Axios client
├── backend/            # Express API
│   ├── models/         # User, Movie, Watched, ActivityLog
│   ├── routes/         # auth, movies, users, admin
│   ├── middleware/      # JWT auth + activity tracking
│   └── seed.js          # Demo movies + admin account
├── README.md
└── SETUP_AND_DEPLOYMENT.md
```

See `SETUP_AND_DEPLOYMENT.md` for full deployment steps (GitHub → Railway → MongoDB Atlas → Vercel).

## Local development

**Backend**
```
cd backend
cp .env.example .env   # fill in MONGODB_URI and JWT_SECRET
npm install
npm run seed            # optional: adds demo movies + admin login
npm run dev
```

**Frontend**
```
cd frontend
cp .env.example .env    # set VITE_API_URL to your backend URL
npm install
npm run dev
```
