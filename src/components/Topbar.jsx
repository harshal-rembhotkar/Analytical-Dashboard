import { useEffect, useState } from "react";

export default function Topbar() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const isDark = stored === "dark";
    document.documentElement.classList.toggle("dark", isDark);
    setDark(isDark);
  }, []);

  const toggle = () => {
    const isDark = !dark;
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  };

  return (
    <header className="h-16 border-b border-[var(--border)] bg-[var(--card)] flex items-center shadow-sm">
      <div className="container-oodl w-full flex items-center gap-4">
        <div className="flex-1">
          <input
            placeholder="Search metrics, services..."
            className="input-modern w-full max-w-md"
          />
        </div>
        <button onClick={toggle} className="btn-secondary">
          {dark ? "☀️ Light" : "🌙 Dark"}
        </button>
        <button className="btn-secondary">🔔</button>
        <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-white font-semibold">
          U
        </div>
      </div>
    </header>
  );
}
