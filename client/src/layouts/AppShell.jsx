import { NavLink } from "react-router-dom";
import useAuth from "../hooks/useAuth";

// Top navigation link
const linkClassName = ({ isActive }) =>
  `inline-flex items-center whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition ${
    isActive
      ? "bg-primary/10 text-primary"
      : "text-on-surface-variant hover:bg-white/10 hover:text-on-surface"
  }`;

// Sidebar link
const sideLinkClassName = ({ isActive }) =>
  `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
    isActive
      ? "bg-primary/10 text-primary"
      : "text-on-surface-variant hover:bg-primary/10 hover:text-on-surface"
  }`;

// Mobile bottom nav link
const mobileLinkClassName = ({ isActive }) =>
  `flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-xl px-1 py-2 text-xs font-medium transition ${
    isActive
      ? "bg-primary/10 text-primary"
      : "text-on-surface-variant hover:bg-primary/10 hover:text-on-surface"
  }`;

// Get initials from username
const getInitials = (value = "") => {
  const parts = value.trim().split(" ").filter(Boolean);
  if (!parts.length) return "V";
  return parts
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
};

const AppShell = ({ children }) => {
  const { isAuthenticated, logout, user } = useAuth();

  return (
    <div className="min-h-screen bg-surface text-on-surface font-body">
      {/* Background effect */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(156,72,234,0.15),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(0,90,194,0.18),transparent_40%)]" />

      {/* HEADER */}
      <header className="fixed left-0 right-0 top-0 z-50 mx-auto mt-6 flex h-16 w-[95%] max-w-7xl items-center justify-between rounded-full border-t border-white/10 bg-surface/40 px-6 shadow-halo backdrop-blur-md">
        
        {/* Logo */}
        <div className="flex items-center gap-2">
          <NavLink to="/" className="font-headline text-xl font-bold text-gradient">
            DomainDubber
          </NavLink>
          <span className="hidden text-xs uppercase tracking-[0.3em] text-on-surface-variant md:inline">
            DomainDubber
          </span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-3 md:flex">
          <NavLink to="/" end className={linkClassName}>Home</NavLink>
          <NavLink to="/videos" className={linkClassName}>Videos</NavLink>
          <NavLink to="/playlists" className={linkClassName}>Playlist</NavLink>
          <NavLink to="/subscriptions" className={linkClassName}>Plans</NavLink>
          <NavLink to="/account" className={linkClassName}>Account</NavLink>
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Notification */}
          <button
            type="button"
            className="rounded-full p-2 text-on-surface-variant transition hover:bg-white/10 hover:text-on-surface"
          >
            <span className="material-symbols-outlined">notifications</span>
          </button>

          {/* Avatar */}
          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/10 text-xs font-semibold">
            {getInitials(user?.name)}
          </div>

          {/* Auth button */}
          {isAuthenticated ? (
            <button
              onClick={logout}
              className="rounded-full border border-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] hover:bg-white/10"
            >
              Logout
            </button>
          ) : (
            <NavLink
              to="/login"
              className="rounded-full border border-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] hover:bg-white/10"
            >
              Login
            </NavLink>
          )}
        </div>
      </header>

      {/* SIDEBAR */}
      <aside className="fixed left-0 top-0 hidden h-full w-64 flex-col border-r border-white/10 bg-surface/60 pt-28 backdrop-blur-md md:flex">
        <nav className="flex flex-col gap-2 px-4">
          <NavLink to="/" end className={sideLinkClassName}>Home</NavLink>
          <NavLink to="/videos" className={sideLinkClassName}>Videos</NavLink>
          <NavLink to="/playlists" className={sideLinkClassName}>Playlist</NavLink>
          <NavLink to="/subscriptions" className={sideLinkClassName}>Plans</NavLink>
          <NavLink to="/account" className={sideLinkClassName}>Account</NavLink>
        </nav>

        {/* User card */}
        <div className="mt-auto px-6 pb-8">
          <div className="flex items-center gap-3 rounded-2xl bg-white/5 p-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-xs font-semibold">
              {getInitials(user?.name)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">
                {user?.name || "Guest"}
              </p>
              <p className="truncate text-[10px] uppercase tracking-[0.25em] text-on-surface-variant">
                {user?.email || "Not signed in"}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="relative mx-auto min-h-screen max-w-screen-2xl px-6 pb-28 pt-28 md:pl-72 md:pb-20">
        {children}
      </main>

      {/* MOBILE NAV */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 flex items-center gap-1 border-t border-white/10 bg-surface/80 px-2 py-2 backdrop-blur-md md:hidden">
        <NavLink to="/" end className={mobileLinkClassName}>
          <span className="material-symbols-outlined">home</span>
          Home
        </NavLink>

        <NavLink to="/videos" className={mobileLinkClassName}>
          <span className="material-symbols-outlined">movie</span>
          Videos
        </NavLink>

        <NavLink to="/playlists" className={mobileLinkClassName}>
          <span className="material-symbols-outlined">subscriptions</span>
          Playlist
        </NavLink>

        <NavLink to="/subscriptions" className={mobileLinkClassName}>
          <span className="material-symbols-outlined">workspace_premium</span>
          Plans
        </NavLink>

        <NavLink to="/account" className={mobileLinkClassName}>
          <span className="material-symbols-outlined">person</span>
          Account
        </NavLink>
      </nav>
    </div>
  );
};

export default AppShell;
