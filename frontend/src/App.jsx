import { Routes, Route } from "react-router-dom";
import CinematicBackground from "./components/CinematicBackground";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import MovieDetail from "./pages/MovieDetail";
import Watchlist from "./pages/Watchlist";
import Downloads from "./pages/Downloads";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import { ProtectedRoute, AdminRoute } from "./components/ProtectedRoute";

export default function App() {
  return (
    <>
    <CinematicBackground />
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      <Route path="/movie/:id" element={<ProtectedRoute><MovieDetail /></ProtectedRoute>} />
      <Route path="/watchlist" element={<ProtectedRoute><Watchlist /></ProtectedRoute>} />
      <Route path="/downloads" element={<ProtectedRoute><Downloads /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
    </Routes>
    </>
  );
}
