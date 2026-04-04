import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { resolveMediaUrl } from "../api/client";
import {
  fetchPlaylists,
  fetchVideo,
  fetchVideos,
  markVideoViewed,
  saveWatchHistory,
  toggleVideoInPlaylist,
} from "../api/services";
import EmptyState from "../components/EmptyState.jsx";
import VideoCard from "../components/VideoCard.jsx";
import useAuth from "../hooks/useAuth";

const PlayerPage = () => {
  const { id } = useParams();
  const { isAuthenticated, user } = useAuth();
  const [video, setVideo] = useState(null);
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [status, setStatus] = useState({
    loading: true,
    error: "",
    actionMessage: "",
  });

  const streamUrl = resolveMediaUrl(`/api/videos/${id}/stream`);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        setStatus({
          loading: true,
          error: "",
          actionMessage: "",
        });

        const requests = [fetchVideo(id), fetchVideos()];

        if (isAuthenticated && user?.canUpload) {
          requests.push(fetchPlaylists());
        }

        const [selectedVideo, allVideos, userPlaylists = []] = await Promise.all(requests);

        if (!isMounted) {
          return;
        }

        setVideo(selectedVideo);
        setRelatedVideos(allVideos.filter((item) => item._id !== id).slice(0, 4));
        setPlaylists(userPlaylists);
        setStatus({
          loading: false,
          error: "",
          actionMessage: "",
        });

        markVideoViewed(id).catch(() => {});

        if (isAuthenticated) {
          saveWatchHistory(id).catch(() => {});
        }
      } catch (requestError) {
        if (!isMounted) {
          return;
        }

        setStatus({
          loading: false,
          error: requestError.response?.data?.message || "Could not load this video.",
          actionMessage: "",
        });
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [id, isAuthenticated, user?.canUpload]);

  const handlePlaylistToggle = async (playlistId) => {
    try {
      const result = await toggleVideoInPlaylist(playlistId, id);
      setPlaylists((current) =>
        current.map((playlist) =>
          playlist._id === playlistId ? result.playlist : playlist
        )
      );
      setStatus((current) => ({
        ...current,
        actionMessage: result.message,
      }));
    } catch (error) {
      setStatus((current) => ({
        ...current,
        actionMessage:
          error.response?.data?.message || "Could not update the playlist.",
      }));
    }
  };

  if (status.loading) {
    return <div className="glass-panel p-6 text-on-surface-variant">Loading player...</div>;
  }

  if (status.error || !video) {
    return (
      <EmptyState
        title="Video unavailable"
        description={status.error || "This video could not be found."}
        action={
          <Link to="/" className="glass-button">
            Back to home
          </Link>
        }
      />
    );
  }

  return (
    <section className="grid gap-8 lg:grid-cols-[1.45fr,0.95fr]">
      <div className="space-y-6">
        <div className="glass-panel overflow-hidden p-4 sm:p-6">
          <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-black">
            <video
              controls
              className="aspect-video w-full bg-black"
              src={streamUrl}
            />
          </div>
        </div>

        <div className="glass-panel space-y-6 p-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="pill">{video.category}</span>
            <span className="pill">{video.views} views</span>
            {video.tags?.map((tag) => (
              <span key={tag} className="pill">
                #{tag}
              </span>
            ))}
          </div>

          <div className="space-y-3">
            <h1 className="font-headline text-3xl font-extrabold text-on-surface">
              {video.title}
            </h1>
            <p className="text-sm text-on-surface-variant">
              by {video.owner?.name || "Unknown creator"}
            </p>
            <p className="text-sm leading-7 text-on-surface-variant">
              {video.description || "No description was provided for this upload."}
            </p>
          </div>

          {isAuthenticated && user?.canUpload ? (
            <div className="glass-card space-y-4 p-5">
              <h2 className="text-lg font-bold text-on-surface">Save to playlist</h2>
              <p className="text-sm text-on-surface-variant">
                Tap a playlist to add or remove this video.
              </p>
              <div className="flex flex-wrap gap-3">
                {playlists.length > 0 ? (
                  playlists.map((playlist) => {
                    const isSaved = playlist.videos.some((item) => item._id === id);

                    return (
                      <button
                        key={playlist._id}
                        type="button"
                        onClick={() => handlePlaylistToggle(playlist._id)}
                        className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] transition ${
                          isSaved
                            ? "bg-primary/20 text-on-surface ring-1 ring-primary/60"
                            : "bg-white/10 text-on-surface-variant hover:bg-white/20"
                        }`}
                      >
                        {isSaved ? "Remove from" : "Add to"} {playlist.name}
                      </button>
                    );
                  })
                ) : (
                  <p className="text-sm text-on-surface-variant">
                    Create a playlist first from the playlist page.
                  </p>
                )}
              </div>
              {status.actionMessage ? (
                <p className="text-sm text-accent">{status.actionMessage}</p>
              ) : null}
              <p className="text-xs uppercase tracking-[0.25em] text-outline">
                Watching while signed in saves this video in your account history.
              </p>
            </div>
          ) : isAuthenticated ? (
            <div className="glass-card p-5 text-sm text-on-surface-variant">
              Your watch history is saved automatically. Playlist editing is only
              available for the owner account.
            </div>
          ) : (
            <div className="glass-card p-5 text-sm text-on-surface-variant">
              Sign in if you want to save this video in your watch history.
            </div>
          )}
        </div>
      </div>

      <aside className="space-y-4">
        <h2 className="font-headline text-xl font-bold text-on-surface">Up next</h2>
        {relatedVideos.length === 0 ? (
          <EmptyState
            title="No related videos yet"
            description="Upload more videos to create a richer watch experience."
          />
        ) : (
          relatedVideos.map((item) => <VideoCard key={item._id} video={item} compact />)
        )}
      </aside>
    </section>
  );
};

export default PlayerPage;