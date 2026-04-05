import { useEffect, useState } from "react";

import { fetchVideos } from "../api/services";
import EmptyState from "../components/EmptyState.jsx";
import SectionTitle from "../components/SectionTitle.jsx";
import VideoCard from "../components/VideoCard.jsx";

const VideosPage = () => {
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
          requestError.response?.data?.message || "Could not load videos right now."
        );
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <div className="space-y-8">
      <SectionTitle
        eyebrow="Library"
        title="All videos"
        description="Browse every upload in your library. Click any card to play."
      />

      {loading ? (
        <div className="glass-panel p-6 text-on-surface-variant">Loading videos...</div>
      ) : null}
      {error ? <div className="glass-panel p-6 text-coral">{error}</div> : null}

      {!loading && !error && videos.length === 0 ? (
        <EmptyState
          title="No videos yet"
          description="Upload your first video from the home page to populate this library."
        />
      ) : null}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {videos.map((video) => (
          <VideoCard key={video._id} video={video} />
        ))}
      </div>
    </div>
  );
};

export default VideosPage;
