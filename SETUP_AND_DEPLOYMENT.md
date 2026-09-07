# MovieRush — Setup & Deployment Guide

## 1. Push this project to GitHub

Open a terminal **inside this folder** (the one containing `frontend/` and `backend/`) and run:

```
git init
git add .
git commit -m "MovieRush full app"
git branch -M main
git remote add origin https://github.com/yeboahseyramk-sys/MovieRush.git
git push -u origin main --force
```

(`--force` overwrites the old empty/partial repo with this full project.)

---

## 2. Set up MongoDB Atlas

1. In Atlas, create a free cluster (if you haven't already).
2. Go to **Database Access** → create a database user with a username + password.
3. Go to **Network Access** → add `0.0.0.0/0` (allow from anywhere) — simplest option while testing.
4. Go to **Connect** → **Drivers** → copy the connection string. It looks like:
   ```
   mongodb+srv://<username>:<password>@<cluster>.mongodb.net/movierush
   ```
   Replace `<username>` and `<password>` with your real values, and make sure `/movierush` is the database name at the end.

---

## 3. Deploy the backend to Railway

1. In Railway, **New Project → Deploy from GitHub repo** → select `MovieRush`.
2. Set the **Root Directory** to `backend`.
3. Go to the service's **Variables** tab and add:
   | Key | Value |
   |---|---|
   | `MONGODB_URI` | your Atlas connection string from step 2 |
   | `JWT_SECRET` | any long random string (e.g. generate one at random.org) |
   | `CLIENT_URL` | your Vercel URL — you can update this after step 4 |
   | `PORT` | `5000` |
4. Deploy. Once live, copy the **public URL** Railway gives you (e.g. `https://movierush-backend.up.railway.app`).
5. (Optional, recommended) Seed sample movies + an admin account: in Railway, open the service's shell/console and run:
   ```
   npm run seed
   ```
   This creates 5 demo movies and an admin login: `admin@movierush.com` / `Admin123!`.

   You already have your own Vercel account set up — no separate action needed there for this step.

---

## 4. Deploy the frontend to Vercel

1. In Vercel, **Import Project** → select `MovieRush`.
2. Set **Root Directory** to `frontend`.
3. Framework should auto-detect as **Vite**.
4. Under **Environment Variables**, add:
   | Key | Value |
   |---|---|
   | `VITE_API_URL` | your Railway backend URL + `/api`, e.g. `https://movierush-backend.up.railway.app/api` |
5. Click **Deploy**.
6. Once deployed, copy your Vercel URL (e.g. `https://movie-rush.vercel.app`) and go back to Railway → update the `CLIENT_URL` variable to that Vercel URL, so CORS allows requests from your live frontend. Redeploy the backend after changing it.

---

## 5. Test it

- Visit your Vercel URL.
- Register a new account (the **first account ever registered becomes admin automatically**), or log in with the seeded admin account above.
- Browse movies, mark one as watched, check badges/reward boxes on your Profile.
- From Profile, tap **Admin Dashboard** to see total users, active users (today/7-day/30-day), signups chart, active-users chart, most-watched movies, and manage users.

---

## Notes

- **Admin access:** the very first person to register on a fresh database becomes admin automatically. After that, admins can promote/demote other users from the Admin Dashboard's Users tab.
- **Active users** are tracked via a daily activity log — any authenticated request counts a user as "active" that day, which powers the Active Today / 7-day / 30-day stats and the chart.
- **Local development:** run `npm install` then `npm run dev` in both `frontend/` and `backend/` (copy `.env.example` to `.env` in each and fill in real values first).
