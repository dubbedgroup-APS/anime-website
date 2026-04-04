import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { fetchVideos } from "../api/services";
import EmptyState from "../components/EmptyState.jsx";
import SectionTitle from "../components/SectionTitle.jsx";
import UploadPanel from "../components/UploadPanel.jsx";
import VideoCard from "../components/VideoCard.jsx";
import useAuth from "../hooks/useAuth";

const creators = [
  { name: "Elena Voss", role: "Audio Curator" },
  { name: "Marcus Thorne", role: "Studio Director" },
  { name: "Julian Grey", role: "Motion Artist" },
  { name: "Sarah Chen", role: "Visual Editor" },
  { name: "David Park", role: "Sound Designer" },
];

const avatarGradients = [
  "from-primary/40 to-secondary/20",
  "from-secondary/40 to-primary/20",
  "from-sun/40 to-primary/10",
  "from-accent/30 to-secondary/20",
  "from-primary/30 to-sun/30",
];

const HomePage = () => {
  const { isAuthenticated, user } = useAuth();
  const [videos, setVideos] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const deferredSearch = useDeferredValue(search);

  const loadVideos = async () => {
    try {
      setLoading(true);
      const items = await fetchVideos();
      setVideos(items);
      setError("");
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || "Could not load videos right now."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVideos();
  }, []);

  const filteredVideos = useMemo(() => {
    const term = deferredSearch.trim().toLowerCase();

    if (!term) {
      return videos;
    }

    return videos.filter((video) => {
      const haystack = [video.title, video.description, video.category, video.owner?.name]
        .join(" ")
        .toLowerCase();

      return haystack.includes(term);
    });
  }, [deferredSearch, videos]);

  const featuredVideo = filteredVideos[0];

  return (
    <div className="space-y-16">
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-surface-container-high/60 p-8 shadow-glow sm:p-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(204,151,255,0.2),transparent_45%),radial-gradient(circle_at_bottom_right,rgba(0,90,194,0.25),transparent_45%)]" />
        <div className="relative space-y-6">
          <span className="pill">Featured technology</span>
          <h1 className="font-headline text-4xl font-extrabold tracking-tight text-on-surface sm:text-6xl">
            Discover the future of <span className="text-gradient">Viode</span>
            <br />
            cinematic streaming.
          </h1>
          <p className="max-w-2xl text-sm leading-7 text-on-surface-variant sm:text-base">
            Build a polished media hub with local uploads, playlists, and a cinematic
            UI. Your library stays on your machine while viewers enjoy fast, smooth
            playback.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              to={featuredVideo ? `/player/${featuredVideo._id}` : "/login"}
              className="rounded-xl bg-gradient-to-r from-primary to-primary-dim px-6 py-3 text-sm font-bold text-on-primary-fixed transition hover:opacity-90"
            >
              Start exploring
            </Link>
            <Link
              to="/playlists"
              className="rounded-full border border-outline-variant/40 px-6 py-3 text-sm font-semibold text-on-surface transition hover:bg-white/10"
            >
              Learn more
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="glass-card p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-on-surface-variant">
                Videos
              </p>
              <p className="mt-3 text-3xl font-bold text-on-surface">
                {videos.length}
              </p>
            </div>
            <div className="glass-card p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-on-surface-variant">
                Storage
              </p>
              <p className="mt-3 text-3xl font-bold text-on-surface">Local</p>
            </div>
            <div className="glass-card p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-on-surface-variant">
                Streaming
              </p>
              <p className="mt-3 text-3xl font-bold text-on-surface">Range</p>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-headline text-2xl font-bold text-on-surface">
            Digital Curators
          </h2>
          <span className="text-sm text-primary">View all creators</span>
        </div>
        <div className="no-scrollbar flex gap-6 overflow-x-auto pb-3">
          {creators.map((creator, index) => (
            <div key={creator.name} className="flex min-w-[110px] flex-col items-center gap-3">
              <div
                className={`flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br ${
                  avatarGradients[index % avatarGradients.length]
                } border border-white/10 text-sm font-semibold text-on-surface`}
              >
                {creator.name
                  .split(" ")
                  .map((chunk) => chunk[0])
                  .join("")}
              </div>
              <div className="text-center">
                <p className="text-xs font-semibold text-on-surface">{creator.name}</p>
                <p className="text-[10px] uppercase tracking-[0.25em] text-on-surface-variant">
                  {creator.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
        <div className="glass-panel p-6">
          <SectionTitle
            eyebrow="Browse"
            title="Find your next stream"
            description="Filter by title, description, category, or creator name without spinning up a heavy search stack."
          />

          <label className="field-shell mt-6">
            <span>Search videos</span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search uploads, creators, or categories"
            />
          </label>

          <div className="mt-6 space-y-4">
            {featuredVideo ? (
              <>
                <p className="text-xs uppercase tracking-[0.25em] text-on-surface-variant">
                  Featured now
                </p>
                <VideoCard video={featuredVideo} compact />
              </>
            ) : (
              <p className="text-sm text-on-surface-variant">
                Upload your first video to feature it here.
              </p>
            )}
          </div>
        </div>

        <div className="glass-panel p-6">
          <h3 className="font-headline text-xl font-bold text-on-surface">
            Smart suggestions
          </h3>
          <p className="mt-2 text-sm leading-6 text-on-surface-variant">
            Keep a fast workflow: upload, preview, and add videos to playlists
            without leaving the home screen.
          </p>
          <div className="mt-6 space-y-4">
            <div className="glass-card p-4">
              <p className="text-xs uppercase tracking-[0.25em] text-on-surface-variant">
                Tip
              </p>
              <p className="mt-3 text-sm text-on-surface">
                Use playlists to group content for different audiences or learning
                paths.
              </p>
            </div>
            <div className="glass-card p-4">
              <p className="text-xs uppercase tracking-[0.25em] text-on-surface-variant">
                Tip
              </p>
              <p className="mt-3 text-sm text-on-surface">
                Track your watch history in the account page to keep context for
                your next session.
              </p>
            </div>
          </div>
        </div>
      </section>

      {isAuthenticated && user?.canUpload ? <UploadPanel onUploaded={loadVideos} /> : null}
      {isAuthenticated && !user?.canUpload ? (
        <div className="glass-panel p-6 text-sm leading-7 text-on-surface-variant">
          Only the owner account can upload videos. Your account can still watch,
          save playlists, and keep a personal history.
        </div>
      ) : null}

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <SectionTitle
            eyebrow="Latest uploads"
            title="Fresh artifacts"
            description="This grid pulls directly from local storage metadata and links each card to the streaming player page."
          />
          <div className="flex gap-2">
            <button
              type="button"
              className="glass-card rounded-full p-2 text-on-surface hover:bg-white/10"
              aria-label="Previous"
            >
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <button
              type="button"
              className="glass-card rounded-full p-2 text-on-surface hover:bg-white/10"
              aria-label="Next"
            >
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="glass-panel p-6 text-on-surface-variant">Loading videos...</div>
        ) : null}
        {error ? <div className="glass-panel p-6 text-coral">{error}</div> : null}
        {!loading && !error && filteredVideos.length === 0 ? (
          <EmptyState
            title="No matching videos"
            description="Try a different search term or upload something new to populate the home feed."
          />
        ) : null}

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredVideos.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>

        <div className="flex justify-center">
          <button className="glass-card flex items-center gap-3 rounded-xl px-6 py-3 text-sm font-semibold text-on-surface transition hover:bg-white/10">
            Discover more artifacts
            <span className="material-symbols-outlined text-primary">expand_more</span>
          </button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;