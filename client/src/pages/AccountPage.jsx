import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { fetchMyVideos } from "../api/services";
import EmptyState from "../components/EmptyState.jsx";
import SectionTitle from "../components/SectionTitle.jsx";
import VideoCard from "../components/VideoCard.jsx";
import useAuth from "../hooks/useAuth";

const AccountPage = () => {
  const { booting, isAuthenticated, refreshProfile, user } = useAuth();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        setLoading(true);
        await Promise.all([refreshProfile(), fetchMyVideos().then(setVideos)]);
        setError("");
      } catch (requestError) {
        setError(requestError.response?.data?.message || "Could not load your account.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [isAuthenticated]);

  if (booting) {
    return <div className="glass-panel p-6 text-on-surface-variant">Loading account...</div>;
  }

  if (!isAuthenticated) {
    return (
      <EmptyState
        title="Sign in to see your creator dashboard"
        description="Your uploads, playlist stats, and account details all live here."
        action={
          <Link to="/login" className="glass-button">
            Go to login
          </Link>
        }
      />
    );
  }

  return (
    <div className="space-y-8">
      <SectionTitle
        eyebrow="Account"
        title={`Welcome back, ${user?.name || "creator"}`}
        description="This page keeps your profile simple: basic account info, upload stats, and your recent watch history."
      />

      <section className="grid gap-6 lg:grid-cols-[1.1fr,1.9fr]">
        <div className="glass-panel space-y-6 p-6">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.3em] text-on-surface-variant">
              Profile
            </p>
            <h3 className="font-headline text-2xl font-bold text-on-surface">
              {user?.name}
            </h3>
            <p className="text-sm text-on-surface-variant">{user?.email}</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="glass-card p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-on-surface-variant">
                Uploads
              </p>
              <p className="mt-3 text-3xl font-bold text-on-surface">
                {user?.stats?.uploads || 0}
              </p>
            </div>
            <div className="glass-card p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-on-surface-variant">
                History
              </p>
              <p className="mt-3 text-3xl font-bold text-on-surface">
                {user?.history?.length || 0}
              </p>
            </div>
          </div>

          <p className="text-sm leading-6 text-on-surface-variant">
            {user?.canUpload
              ? "Your owner account can upload every video on the site. Other users can only watch and save history."
              : "Your account can watch videos, build playlists, and keep a personal history tied to your sign-in."}
          </p>

          <div className="grid gap-4">
            <div className="glass-card p-5">
              <h4 className="text-lg font-bold text-on-surface">My playlists</h4>
              <p className="mt-1 text-sm text-on-surface-variant">
                Quick access to your curated collections.
              </p>
            </div>
            <div className="glass-card p-5">
              <h4 className="text-lg font-bold text-on-surface">Creator tools</h4>
              <p className="mt-1 text-sm text-on-surface-variant">
                Manage uploads, update metadata, and control playback quality.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-bold text-on-surface">
            {user?.canUpload ? "Your uploads" : "Your watch history"}
          </h3>
          {loading ? <div className="glass-panel p-6 text-on-surface-variant">Loading videos...</div> : null}
          {error ? <div className="glass-panel p-6 text-coral">{error}</div> : null}
          {user?.canUpload ? (
            <>
              {!loading && !error && videos.length === 0 ? (
                <EmptyState
                  title="No uploads yet"
                  description="Head back to the home page and publish your first video to see it here."
                />
              ) : null}
              <div className="grid gap-4">
                {videos.map((video) => (
                  <VideoCard key={video._id} video={video} compact />
                ))}
              </div>
            </>
          ) : (
            <>
              {!loading && !error && (user?.history?.length || 0) === 0 ? (
                <EmptyState
                  title="No watch history yet"
                  description="Open any video while signed in and it will appear here automatically."
                />
              ) : null}
              <div className="grid gap-4">
                {(user?.history || []).map((entry) => (
                  <div key={`${entry.video._id}-${entry.watchedAt}`} className="space-y-2">
                    <VideoCard video={entry.video} compact />
                    <p className="px-3 text-xs uppercase tracking-[0.2em] text-outline">
                      Watched {new Date(entry.watchedAt).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default AccountPage;