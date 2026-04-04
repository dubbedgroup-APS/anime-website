import { Link } from "react-router-dom";

const formatNumber = (value) => new Intl.NumberFormat().format(value || 0);

const formatDate = (value) =>
  new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));

const gradients = [
  "from-primary/30 via-surface-container-high to-secondary/20",
  "from-secondary/30 via-surface-container-high to-primary/20",
  "from-sun/30 via-surface-container-high to-primary/10",
  "from-accent/20 via-surface-container-high to-secondary/20",
];

const pickGradient = (seed) => {
  const index = Math.abs(String(seed || "").length) % gradients.length;
  return gradients[index];
};

const VideoCard = ({ video, compact = false }) => (
  <Link
    to={`/player/${video._id}`}
    className={`glass-card group flex overflow-hidden transition hover:-translate-y-1 ${
      compact ? "flex-row gap-4 p-3" : "flex-col"
    }`}
  >
    <div
      className={`relative overflow-hidden ${
        compact ? "h-28 w-40 rounded-2xl" : "aspect-video w-full"
      }`}
    >
      <div
        className={`h-full w-full bg-gradient-to-br ${pickGradient(video._id)} transition duration-500 group-hover:scale-105`}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-surface/80 via-transparent to-transparent" />
      <div className="absolute bottom-3 left-3 rounded-full bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-on-surface-variant">
        {video.category}
      </div>
    </div>

    <div className={`flex flex-1 flex-col gap-2 ${compact ? "py-1 pr-2" : "p-5"}`}>
      <div className="flex items-center justify-between gap-3">
        <span className="pill">{video.category}</span>
        <span className="text-xs text-on-surface-variant">
          {formatNumber(video.views)} views
        </span>
      </div>
      <h3 className="line-clamp-2 text-lg font-bold text-on-surface">
        {video.title}
      </h3>
      <p className="text-sm text-on-surface-variant">
        {video.owner?.name || "Unknown creator"}
      </p>
      <p className="line-clamp-2 text-sm leading-6 text-on-surface-variant">
        {video.description || "No description provided yet."}
      </p>
      <p className="mt-auto text-xs uppercase tracking-[0.25em] text-outline">
        Uploaded {formatDate(video.createdAt)}
      </p>
    </div>
  </Link>
);

export default VideoCard;
