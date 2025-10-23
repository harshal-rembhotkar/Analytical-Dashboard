import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";

const links = [
  { to: "/", label: "Dashboard" },
  { to: "/metrics", label: "Metrics" },
  { to: "/alerts", label: "Alerts" },
  { to: "/settings", label: "Settings" },
];

export default function Sidebar() {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 1024px)");
    const handler = (e) => setOpen(!e.matches);
    handler(media);
    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, []);

  return (
    <aside
      className={`${open ? "w-64" : "w-16"} transition-all duration-200 border-r border-[var(--border)] bg-[var(--card)] text-sm flex flex-col shadow-lg`}
    >
      <div className="h-16 flex items-center justify-between px-6 border-b border-[var(--border)]">
        <span className="font-bold text-lg gradient-primary bg-clip-text text-transparent">
          Cosdata
        </span>
        <button
          className="lg:hidden p-2 rounded-lg hover:bg-[var(--accent-light)]"
          onClick={() => setOpen(!open)}
          aria-label="Toggle Sidebar"
        >
          <span className="text-[var(--text-muted)]">≡</span>
        </button>
      </div>
      <nav className="p-4 space-y-2">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-4 py-3 hover:bg-[var(--accent-light)] transition-colors ${isActive ? "bg-[var(--accent)] text-white font-semibold shadow-md" : "text-[var(--text-muted)] hover:text-[var(--accent)]"}`
            }
          >
            <span className="w-5 text-center text-lg">•</span>
            <span
              className={`${open ? "block" : "hidden"} lg:block font-medium`}
            >
              {l.label}
            </span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
