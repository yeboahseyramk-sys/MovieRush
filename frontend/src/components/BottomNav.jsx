import { NavLink } from "react-router-dom";
import { Home, Bookmark, Download, User } from "lucide-react";

const items = [
  { to: "/", label: "Home", icon: Home },
  { to: "/watchlist", label: "Watchlist", icon: Bookmark },
  { to: "/downloads", label: "Downloads", icon: Download },
  { to: "/profile", label: "Profile", icon: User },
];

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-surface/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-md items-center justify-around py-2">
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-3 py-1.5 text-xs transition-colors ${
                isActive ? "text-accent" : "text-white/40"
              }`
            }
          >
            <Icon size={20} strokeWidth={2.2} />
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
