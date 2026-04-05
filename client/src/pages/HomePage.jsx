import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { fetchVideos } from "../api/services";
import { resolveMediaUrl } from "../api/client";
import UploadPanel from "../components/UploadPanel.jsx";
import useAuth from "../hooks/useAuth";

const creators = [
  { name: "Elena Voss", role: "Audio Curator", imageUrl: "" },
  { name: "Marcus Thorne", role: "Studio Director", imageUrl: "" },
  { name: "Julian Grey", role: "Motion Artist", imageUrl: "" },
  { name: "Sarah Chen", role: "Visual Editor", imageUrl: "" },
  { name: "David Park", role: "Sound Designer", imageUrl: "" },
];

const trending = [
  {
    title: "The Apex Narrative",
    label: "MOST VIEWED",
    description:
      "A cinematic journey across the highest peaks of the Himalayas, dubbed with precision.",
    imageUrl: "",
  },
  {
    title: "Abyssal Dreams",
    description: "Deep sea exploration series",
    imageUrl: "",
  },
  { title: "Global Flux", imageUrl: "" },
  { title: "Stellar Drift", imageUrl: "" },
];

const placeholderGradients = [
  "from-primary/40 via-surface-container-high to-secondary/20",
  "from-secondary/40 via-surface-container-high to-primary/10",
  "from-accent/40 via-surface-container-high to-primary/20",
  "from-primary/30 via-surface-container-high to-sun/30",
];

const getInitials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

const pickGradient = (seed) =>
  placeholderGradients[seed % placeholderGradients.length];

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

  const featuredVideo = useMemo(() => videos[0], [videos]);

  return (
    <div className="space-y-20">
      <section className="relative min-h-[520px] overflow-hidden rounded-3xl border border-white/10 bg-surface-container-high/60">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(156,72,234,0.25),transparent_45%),radial-gradient(circle_at_bottom_right,rgba(0,90,194,0.25),transparent_45%)]" />

        <div className="relative z-10 max-w-3xl space-y-8 p-10 sm:p-12">
          <span className="inline-block rounded-full bg-surface-container-high px-4 py-1 text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
            Featured technology
          </span>
          <h1 className="text-4xl font-headline font-extrabold tracking-tight text-on-surface sm:text-6xl lg:text-7xl">
            Discover the future of
            <br />
            <span className="text-gradient">content dubbing</span>
          </h1>
          <p className="text-base leading-relaxed text-on-surface-variant sm:text-lg">
            Experience localized entertainment like never before. High-fidelity
            audio artifacts curated for the modern digital connoisseur.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              to={featuredVideo ? `/player/${featuredVideo._id}` : "/login"}
              className="rounded-md bg-gradient-to-r from-primary to-primary-dim px-8 py-4 text-sm font-bold text-on-primary-fixed shadow-lg shadow-primary-dim/20 transition hover:opacity-90"
            >
              Start exploring
            </Link>
            <Link
              to="/playlists"
              className="rounded-full border border-outline-variant/20 bg-white/5 px-8 py-4 text-sm font-semibold text-on-surface transition hover:bg-white/10"
            >
              Learn more
            </Link>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-headline font-bold text-on-surface">
            Digital Curators
          </h2>
          <span className="text-sm font-medium text-primary">View all creators</span>
        </div>
        <div className="no-scrollbar flex gap-6 overflow-x-auto pb-4">
          {creators.map((creator) => (
            <div
              key={creator.name}
              className="group flex min-w-[110px] flex-col items-center gap-3"
            >
              <div className="h-20 w-20 rounded-full border-2 border-primary/20 bg-white/5 transition-all group-hover:border-primary">
                {creator.imageUrl ? (
                  <img
                    src={creator.imageUrl}
                    alt={creator.name}
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-on-surface">
                    {getInitials(creator.name)}
                  </div>
                )}
              </div>
              <span className="text-xs font-medium text-on-surface-variant group-hover:text-primary">
                {creator.name}
              </span>
            </div>
          ))}
        </div>
      </section>

      {isAuthenticated && user?.canUpload ? <UploadPanel /> : null}
      {isAuthenticated && !user?.canUpload ? (
        <div className="glass-card rounded-2xl p-6 text-sm text-on-surface-variant">
          Only the owner account can upload videos. Your account can still watch,
          save playlists, and keep a personal history.
        </div>
      ) : null}

      <section className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-4xl font-headline font-bold text-on-surface">
            Latest Artifacts
          </h2>
          <div className="flex gap-2">
            <button
              type="button"
              className="glass-card rounded-full p-2 text-on-surface hover:bg-white/10"
            >
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <button
              type="button"
              className="glass-card rounded-full p-2 text-on-surface hover:bg-white/10"
            >
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="glass-card rounded-2xl p-6 text-on-surface-variant">
            Loading videos...
          </div>
        ) : null}
        {error ? (
          <div className="glass-card rounded-2xl p-6 text-coral">{error}</div>
        ) : null}

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {videos.map((video, index) => (
            <Link
              key={video._id}
              to={`/player/${video._id}`}
              className="group block"
            >
              <div className="glass-card relative mb-4 aspect-video overflow-hidden rounded-xl transition-all duration-300 group-hover:scale-[1.02]">
                {video.thumbnailPath ? (
                  <img
                    src={resolveMediaUrl(video.thumbnailPath)}
                    alt={video.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className={`h-full w-full bg-gradient-to-br ${pickGradient(index)}`} />
                )}
                <div className="absolute inset-0 bg-black/20 opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="absolute bottom-3 right-3 rounded bg-black/60 px-2 py-1 text-[10px] font-bold text-white">
                  {video.duration || "12:45"}
                </div>
              </div>
              <div className="px-2">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-lg font-semibold text-on-surface transition-colors group-hover:text-primary">
                    {video.title}
                  </h3>
                  <span className="material-symbols-outlined text-sm text-on-surface-variant">
                    more_vert
                  </span>
                </div>
                <div className="mt-1 flex items-center gap-2 text-xs text-on-surface-variant">
                  <span>{video.category || "General"}</span>
                  <span className="h-1 w-1 rounded-full bg-outline-variant"></span>
                  <span>{video.views || 0} Views</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-10">
        <h2 className="text-4xl font-headline font-bold text-on-surface">
          Trending Masterpieces
        </h2>
        <div className="grid auto-rows-[250px] grid-cols-1 gap-6 md:grid-cols-4">
          <div className="group relative overflow-hidden rounded-xl glass-card md:col-span-2 md:row-span-2">
            {trending[0].imageUrl ? (
              <img
                src={trending[0].imageUrl}
                alt={trending[0].title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className={`h-full w-full bg-gradient-to-br ${pickGradient(0)}`} />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest to-transparent opacity-80" />
            <div className="absolute bottom-0 left-0 space-y-4 p-8">
              <span className="inline-block rounded bg-primary px-2 py-1 text-[10px] font-bold text-on-primary-fixed">
                {trending[0].label}
              </span>
              <h3 className="text-3xl font-headline font-bold text-white">
                {trending[0].title}
              </h3>
              <p className="text-sm text-slate-300">{trending[0].description}</p>
              <button className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-primary">
                Watch now
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-xl glass-card md:col-span-2">
            {trending[1].imageUrl ? (
              <img
                src={trending[1].imageUrl}
                alt={trending[1].title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className={`h-full w-full bg-gradient-to-br ${pickGradient(1)}`} />
            )}
            <div className="absolute inset-0 bg-black/40 transition-all group-hover:bg-black/20" />
            <div className="absolute bottom-4 left-6">
              <h4 className="text-xl font-headline font-bold text-white">
                {trending[1].title}
              </h4>
              <p className="text-xs text-slate-300">{trending[1].description}</p>
            </div>
          </div>

          {trending.slice(2).map((item, index) => (
            <div
              key={item.title}
              className="group relative overflow-hidden rounded-xl glass-card"
            >
              {item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className={`h-full w-full bg-gradient-to-br ${pickGradient(index + 2)}`} />
              )}
              <div className="absolute inset-0 bg-black/40" />
              <div className="absolute bottom-4 left-6">
                <h4 className="text-lg font-headline font-bold text-white">
                  {item.title}
                </h4>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="mt-20 flex flex-col items-center gap-4 border-t border-white/5 bg-surface/20 px-8 py-12 text-xs uppercase tracking-widest text-on-surface-variant">
        <div className="flex flex-wrap gap-8">
          <span className="transition-colors hover:text-white">About</span>
          <span className="transition-colors hover:text-white">Privacy</span>
          <span className="transition-colors hover:text-white">Terms</span>
          <span className="transition-colors hover:text-white">Support</span>
        </div>
        <p className="font-headline text-lg font-bold text-on-surface">
          Domain Dubbing
        </p>
        <p>� 2024 Domain Dubbing. Digital Curator.</p>
      </footer>
    </div>
  );
};

export default HomePage;
