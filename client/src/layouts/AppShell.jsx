import { NavLink } from "react-router-dom";

import useAuth from "../hooks/useAuth";

const linkClassName = ({ isActive }) =>
  `rounded-full px-4 py-2 text-sm font-semibold transition ${
    isActive
      ? "text-primary border-b-2 border-primary"
      : "text-on-surface-variant hover:bg-white/10 hover:text-on-surface"
  }`;

const sideLinkClassName = ({ isActive }) =>
  `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
    isActive
      ? "bg-primary/10 text-primary border-r-2 border-primary"
      : "text-on-surface-variant hover:bg-primary/10 hover:text-on-surface"
  }`;

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
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(156,72,234,0.15),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(0,90,194,0.18),transparent_40%)]" />

      <header className="fixed left-0 right-0 top-0 z-50 mx-auto mt-6 flex h-16 w-[95%] max-w-7xl items-center justify-between rounded-full border-t border-white/10 bg-surface/40 px-6 shadow-halo backdrop-blur-md">
        <div className="flex items-center gap-2">
          <NavLink to="/" className="font-headline text-xl font-bold text-gradient">
            DomainDubber
          </NavLink>
          <span className="hidden text-xs uppercase tracking-[0.3em] text-on-surface-variant md:inline">
            DomainDubber
          </span>
        </div>

        <nav className="hidden items-center gap-6 md:flex">
          <NavLink to="/" end className={linkClassName}>
            Home
          </NavLink>
          <NavLink to="/videos" className={linkClassName}>
            Videos
          </NavLink>
          <NavLink to="/playlists" className={linkClassName}>
            Playlist
          </NavLink>
          <NavLink to="/subscriptions" className={linkClassName}>
            Subscription
          </NavLink>
          <NavLink to="/account" className={linkClassName}>
            Account
          </NavLink>
        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="rounded-full p-2 text-on-surface-variant transition hover:bg-white/10 hover:text-on-surface"
            aria-label="Notifications"
          >
            <span className="material-symbols-outlined">notifications</span>
          </button>

          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/10 text-xs font-semibold text-on-surface">
            {getInitials(user?.name)}
          </div>

          {isAuthenticated ? (
            <button
              type="button"
              onClick={logout}
              className="rounded-full border border-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-on-surface transition hover:bg-white/10"
            >
              Sign out
            </button>
          ) : (
            <NavLink to="/login" className="glass-button text-xs uppercase tracking-[0.25em]">
              Sign in
            </NavLink>
          )}
        </div>
      </header>

      <aside className="fixed left-0 top-0 z-40 hidden h-full w-64 flex-col border-r border-white/5 bg-surface/40 pt-28 text-sm backdrop-blur-xl md:flex">
        <div className="flex flex-col gap-2 px-6">
          <NavLink to="/" end className={sideLinkClassName}>
            <span className="material-symbols-outlined">home</span>
            Home
          </NavLink>
          <NavLink to="/videos" className={sideLinkClassName}>
            <span className="material-symbols-outlined">movie</span>
            Videos
          </NavLink>
          <NavLink to="/playlists" className={sideLinkClassName}>
            <span className="material-symbols-outlined">subscriptions</span>
            Playlist
          </NavLink>
          <NavLink to="/subscriptions" className={sideLinkClassName}>
            <span className="material-symbols-outlined">workspace_premium</span>
            Subscription
          </NavLink>
          <NavLink to="/account" className={sideLinkClassName}>
            <span className="material-symbols-outlined">person</span>
            Account
          </NavLink>
        </div>

        <div className="mt-auto px-6 pb-8">
          <div className="glass-card flex items-center gap-3 rounded-2xl p-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-xs font-semibold">
              {getInitials(user?.name)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-on-surface">
                {user?.name || "Guest"}
              </p>
              <p className="truncate text-[10px] uppercase tracking-[0.25em] text-on-surface-variant">
                {user?.email || "Not signed in"}
              </p>
            </div>
          </div>
        </div>
      </aside>

      <main className="relative mx-auto min-h-screen max-w-screen-2xl px-6 pb-28 pt-28 md:pl-72 md:pb-20">
        {children}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t border-white/10 bg-surface/80 px-4 py-3 backdrop-blur-md md:hidden">
        <NavLink to="/" end className={sideLinkClassName}>
          <span className="material-symbols-outlined">home</span>
          Home
        </NavLink>
        <NavLink to="/videos" className={sideLinkClassName}>
          <span className="material-symbols-outlined">movie</span>
          Videos
        </NavLink>
        <NavLink to="/playlists" className={sideLinkClassName}>
          <span className="material-symbols-outlined">subscriptions</span>
          Playlist
        </NavLink>
        <NavLink to="/subscriptions" className={sideLinkClassName}>
          <span className="material-symbols-outlined">workspace_premium</span>
          Plans
        </NavLink>
        <NavLink to="/account" className={sideLinkClassName}>
          <span className="material-symbols-outlined">person</span>
          Account
        </NavLink>
      </nav>
    </div>
  );
};

export default AppShell;
