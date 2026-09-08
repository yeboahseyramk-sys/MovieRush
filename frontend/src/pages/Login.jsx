import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Clapperboard } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-center relative z-10 px-6 py-10">
      <div className="mx-auto w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-2">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-accent-pink">
            <Clapperboard size={26} />
          </div>
          <h1 className="text-2xl font-bold">
            Movie<span className="text-accent">Rush</span>
          </h1>
          <p className="text-sm text-white/40">Welcome back</p>
        </div>

        <form onSubmit={submit} className="flex flex-col gap-3">
          <input
            type="email"
            required
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="rounded-xl2 border border-white/10 bg-surface px-4 py-3 text-sm outline-none focus:border-accent"
          />
          <input
            type="password"
            required
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="rounded-xl2 border border-white/10 bg-surface px-4 py-3 text-sm outline-none focus:border-accent"
          />
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button
            disabled={loading}
            className="mt-2 rounded-xl2 bg-gradient-to-r from-accent to-accent-pink py-3 text-sm font-semibold disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-white/40">
          Don't have an account?{" "}
          <Link to="/register" className="font-medium text-accent">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
