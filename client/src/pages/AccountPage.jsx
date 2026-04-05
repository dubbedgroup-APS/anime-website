import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { deleteVideo, fetchMyVideos } from "../api/services";
import EmptyState from "../components/EmptyState.jsx";
import SectionTitle from "../components/SectionTitle.jsx";
import VideoCard from "../components/VideoCard.jsx";
import useAuth from "../hooks/useAuth";

const AccountPage = () => {
  const { booting, isAuthenticated, refreshProfile, user } = useAuth();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingVideoId, setDeletingVideoId] = useState("");
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
  }, [isAuthenticated, refreshProfile]);

  const handleDeleteVideo = async (videoId) => {
    const confirmed = window.confirm("Delete this video permanently?");
    if (!confirmed) return;

    try {
      setDeletingVideoId(videoId);
      await deleteVideo(videoId);
      setVideos((current) => current.filter((video) => video._id !== videoId));
      await refreshProfile();
      setError("");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not delete this video.");
    } finally {
      setDeletingVideoId("");
    }
  };

  if (booting) {
    return <div className="glass-panel p-6">Loading account...</div>;
  }

  if (!isAuthenticated) {
    return (
      <EmptyState
        title="Sign in to see your creator dashboard"
        description="Your uploads and account details live here."
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
        description="Manage your uploads and profile."
      />

      <div className="grid gap-4">
        {videos.map((video) => (
          <div key={video._id} className="space-y-2">
            <VideoCard video={video} compact />

            <div className="flex justify-end">
              <button
                onClick={() => handleDeleteVideo(video._id)}
                disabled={deletingVideoId === video._id}
                className="rounded-full border border-coral/40 px-4 py-2 text-xs font-semibold text-coral"
              >
                {deletingVideoId === video._id ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AccountPage;
