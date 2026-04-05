import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { fetchVideos } from "../api/services";
import { resolveMediaUrl } from "../api/client";
import UploadPanel from "../components/UploadPanel.jsx";
import useAuth from "../hooks/useAuth";

const placeholderGradients = [
  "from-primary/40 via-surface-container-high to-secondary/20",
  "from-secondary/40 via-surface-container-high to-primary/10",
  "from-accent/40 via-surface-container-high to-primary/20",
  "from-primary/30 via-surface-container-high to-sun/30",
];

const pickGradient = (seed) =>
  placeholderGradients[seed % placeholderGradients.length];

const VideoGrid = ({ title, videos, emptyText }) => (
  <section className="space-y-4">
    <h2 className="text-xl font-bold text-on-surface sm:text-2xl">{title}</h2>
    {videos.length === 0 ? (
      <div className="glass-card rounded-2xl p-6 text-sm text-on-surface-variant">
        {emptyText}
      </div>
    ) : (
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {videos.map((video, index) => (
          <Link key={video._id} to={`/player/${video._id}`} className="group">
            <div className="glass-card relative mb-3 aspect-video overflow-hidden rounded-2xl transition-all duration-300 group-hover:scale-[1.02]">
              {video.thumbnailPath ? (
                <img
                  src={resolveMediaUrl(video.thumbnailPath)}
                  alt={video.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              ) : (
                <div className={`h-full w-full bg-gradient-to-br ${pickGradient(index)}`} />
              )}
              <div className="absolute bottom-3 right-3 rounded bg-black/60 px-2 py-1 text-[10px] font-bold text-white">
                {video.duration || "12:45"}
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-on-surface transition-colors group-hover:text-primary">
                {video.title}
              </h3>
              <p className="text-xs text-on-surface-variant">
                {video.category || "General"} � {video.views || 0} views
              </p>
            </div>
          </Link>
        ))}
      </div>
    )}
  </section>
);

const HomePage = () => {
  const { isAuthenticated, user } = useAuth();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const items = await fetchVideos();
        setVideos(items);
        setError("");
      } catch (requestError) {
        setError(
          requestError.response?.data?.message ||
            "Could not load videos right now."
        );
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const latestVideos = useMemo(() => videos.slice(0, 6), [videos]);
  const subscriptionVideos = useMemo(() => videos.slice(0, 4), [videos]);
  const mostViewed = useMemo(
    () => [...videos].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 6),
    [videos]
  );

  return (
    <div className="space-y-10">
      <section className="glass-panel space-y-4 p-6 sm:p-8">
        <p className="text-xs uppercase tracking-[0.3em] text-on-surface-variant">
          DomainDubber
        </p>
        <h1 className="text-3xl font-extrabold text-on-surface sm:text-4xl">
          Your video library, clean and simple
        </h1>
        <p className="text-sm text-on-surface-variant sm:text-base">
          Upload your own videos and keep everything in one place. No stock images.
        </p>
      </section>

      {isAuthenticated && user?.canUpload ? <UploadPanel /> : null}
      {isAuthenticated && !user?.canUpload ? (
        <div className="glass-card rounded-2xl p-6 text-sm text-on-surface-variant">
          Only the owner account can upload videos. Your account can still watch and
          keep history.
        </div>
      ) : null}

      {loading ? (
        <div className="glass-card rounded-2xl p-6 text-on-surface-variant">
          Loading videos...
        </div>
      ) : null}
      {error ? <div className="glass-card rounded-2xl p-6 text-coral">{error}</div> : null}

      {!loading ? (
        <>
          <VideoGrid
            title="Latest Videos"
            videos={latestVideos}
            emptyText="Upload your first video to see it here."
          />
          <VideoGrid
            title="Subscriptions"
            videos={subscriptionVideos}
            emptyText="No subscription videos yet."
          />
          <VideoGrid
            title="Most Viewed"
            videos={mostViewed}
            emptyText="No views yet."
          />
        </>
      ) : null}
    </div>
  );
};

export default HomePage;
