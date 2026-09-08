import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, Users, UserCheck, Film, Eye, TrendingUp, Search, Trash2, Shield,
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import api from "../api/axios";

function StatCard({ label, value, icon: Icon, accent }) {
  return (
    <div className="rounded-xl2 bg-surface p-4">
      <div className={`mb-2 flex h-9 w-9 items-center justify-center rounded-full ${accent}`}>
        <Icon size={16} />
      </div>
      <p className="text-xl font-bold">{value}</p>
      <p className="text-xs text-white/40">{label}</p>
    </div>
  );
}

export default function Admin() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [signups, setSignups] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);
  const [topMovies, setTopMovies] = useState([]);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("overview");

  const loadAll = async () => {
    const [s, su, au, tm, us] = await Promise.all([
      api.get("/admin/stats"),
      api.get("/admin/analytics/signups"),
      api.get("/admin/analytics/active-users"),
      api.get("/admin/analytics/top-movies"),
      api.get("/admin/users"),
    ]);
    setStats(s.data);
    setSignups(su.data.map((d) => ({ ...d, date: d.date.slice(5) })));
    setActiveUsers(au.data.map((d) => ({ ...d, date: d.date.slice(5) })));
    setTopMovies(tm.data);
    setUsers(us.data.users);
  };

  useEffect(() => {
    loadAll();
  }, []);

  const searchUsers = async (q) => {
    setSearch(q);
    const { data } = await api.get("/admin/users", { params: { search: q } });
    setUsers(data.users);
  };

  const deleteUser = async (id) => {
    if (!confirm("Delete this user?")) return;
    await api.delete(`/admin/users/${id}`);
    setUsers((u) => u.filter((x) => x._id !== id));
  };

  const toggleRole = async (u) => {
    const newRole = u.role === "admin" ? "user" : "admin";
    const { data } = await api.patch(`/admin/users/${u._id}/role`, { role: newRole });
    setUsers((list) => list.map((x) => (x._id === u._id ? data : x)));
  };

  if (!stats) return <div className="flex h-screen items-center justify-center text-white/50 relative z-10">Loading dashboard...</div>;

  return (
    <div className="min-h-screen relative z-10 pb-10 text-white">
      <div className="mx-auto max-w-2xl px-4 pt-6">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/profile")} className="flex h-9 w-9 items-center justify-center rounded-full bg-surface">
            <ArrowLeft size={18} />
          </button>
          <h1 className="text-lg font-bold">Admin Dashboard</h1>
        </div>

        <div className="mt-4 flex gap-2">
          {["overview", "users"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize ${
                tab === t ? "bg-accent" : "bg-surface text-white/50"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === "overview" && (
          <>
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
              <StatCard label="Total Users" value={stats.totalUsers} icon={Users} accent="bg-accent/20 text-accent" />
              <StatCard label="Active Today" value={stats.activeToday} icon={UserCheck} accent="bg-green-500/20 text-green-400" />
              <StatCard label="Active (7 days)" value={stats.activeThisWeek} icon={TrendingUp} accent="bg-blue-500/20 text-blue-400" />
              <StatCard label="Active (30 days)" value={stats.activeThisMonth} icon={UserCheck} accent="bg-purple-500/20 text-accent-light" />
              <StatCard label="Total Movies" value={stats.totalMovies} icon={Film} accent="bg-pink-500/20 text-accent-pink" />
              <StatCard label="Total Watches" value={stats.totalWatches} icon={Eye} accent="bg-yellow-500/20 text-yellow-400" />
            </div>

            <div className="mt-6 rounded-xl2 bg-surface p-4">
              <h3 className="mb-3 text-sm font-semibold">New Signups (last 14 days)</h3>
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={signups}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#ffffff60" }} />
                  <YAxis tick={{ fontSize: 10, fill: "#ffffff60" }} allowDecimals={false} />
                  <Tooltip contentStyle={{ background: "#1A1530", border: "none", borderRadius: 8, fontSize: 12 }} />
                  <Line type="monotone" dataKey="count" stroke="#7C5CFC" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 rounded-xl2 bg-surface p-4">
              <h3 className="mb-3 text-sm font-semibold">Active Users (last 14 days)</h3>
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={activeUsers}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#ffffff60" }} />
                  <YAxis tick={{ fontSize: 10, fill: "#ffffff60" }} allowDecimals={false} />
                  <Tooltip contentStyle={{ background: "#1A1530", border: "none", borderRadius: 8, fontSize: 12 }} />
                  <Line type="monotone" dataKey="count" stroke="#EC4899" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 rounded-xl2 bg-surface p-4">
              <h3 className="mb-3 text-sm font-semibold">Most Watched Movies</h3>
              <div className="flex flex-col gap-2">
                {topMovies.map((m, i) => (
                  <div key={m._id} className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <span className="text-white/30">#{i + 1}</span> {m.title}
                    </span>
                    <span className="text-white/40">{m.views} views</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {tab === "users" && (
          <div className="mt-5">
            <div className="mb-3 flex items-center gap-2 rounded-xl2 bg-surface px-4 py-2.5">
              <Search size={15} className="text-white/40" />
              <input
                value={search}
                onChange={(e) => searchUsers(e.target.value)}
                placeholder="Search users..."
                className="w-full bg-transparent text-sm outline-none"
              />
            </div>
            <div className="flex flex-col gap-2">
              {users.map((u) => (
                <div key={u._id} className="flex items-center justify-between rounded-xl2 bg-surface p-3">
                  <div className="flex items-center gap-3">
                    <img src={u.avatar} className="h-9 w-9 rounded-full object-cover" />
                    <div>
                      <p className="text-sm font-medium">{u.username}</p>
                      <p className="text-xs text-white/40">{u.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-white/40">{u.moviesWatched} watched</span>
                    <button onClick={() => toggleRole(u)} title="Toggle admin" className="rounded-full bg-surface2 p-1.5">
                      <Shield size={13} className={u.role === "admin" ? "text-accent" : "text-white/30"} />
                    </button>
                    <button onClick={() => deleteUser(u._id)} className="rounded-full bg-surface2 p-1.5">
                      <Trash2 size={13} className="text-red-400" />
                    </button>
                  </div>
                </div>
              ))}
              {users.length === 0 && <p className="text-sm text-white/30">No users found.</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
