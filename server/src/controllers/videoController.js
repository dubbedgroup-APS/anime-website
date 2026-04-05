import fs from "fs";
import { randomUUID } from "crypto";

import { isCloudinaryEnabled } from "../config/cloudinary.js";
import { resolveStoredPath } from "../utils/storage.js";
import {
  deleteVideoById,
  addVideoToHistory,
  createVideo,
  getAllVideos,
  getRawVideoById,
  getVideoById as getStoredVideoById,
  getVideosByOwner,
  incrementVideoViews,
} from "../utils/dataStore.js";
import {
  buildCloudinaryVideoThumbnail,
  uploadImageToCloudinary,
  uploadVideoToCloudinary,
} from "../utils/cloudinaryUpload.js";
import { saveBufferLocally } from "../utils/localMedia.js";

const DEFAULT_STREAM_CHUNK_SIZE = 10 ** 6;

const formatTags = (tags = "") =>
  tags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

export const getVideos = async (_request, response, next) => {
  try {
@@ -159,50 +160,91 @@ export const incrementViewCount = async (request, response, next) => {
    });
  } catch (error) {
    next(error);
  }
};

export const saveWatchHistory = async (request, response, next) => {
  try {
    const history = await addVideoToHistory(request.user._id, request.params.id);

    if (!history) {
      return response.status(404).json({
        message: "Video not found.",
      });
    }

    response.json({
      message: "Watch history updated.",
      history,
    });
  } catch (error) {
    next(error);
  }
};

const removeStoredFileIfLocal = (filePath = "") => {
  if (!filePath || filePath.startsWith("http")) {
    return;
  }

  const resolvedPath = resolveStoredPath(filePath);

  if (fs.existsSync(resolvedPath)) {
    fs.unlinkSync(resolvedPath);
  }
};

export const deleteVideo = async (request, response, next) => {
  try {
    const existingVideo = await getRawVideoById(request.params.id);

    if (!existingVideo) {
      return response.status(404).json({
        message: "Video not found.",
      });
    }

    const deletedVideo = await deleteVideoById(request.params.id);

    if (!deletedVideo) {
      return response.status(404).json({
        message: "Video not found.",
      });
    }

    removeStoredFileIfLocal(deletedVideo.videoPath);
    removeStoredFileIfLocal(deletedVideo.thumbnailPath);

    response.json({
      message: "Video deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};

export const streamVideo = async (request, response, next) => {
  try {
    const video = await getRawVideoById(request.params.id);

    if (!video) {
      return response.status(404).json({
        message: "Video not found.",
      });
    }

    if (video.videoPath?.startsWith("http")) {
      response.redirect(video.videoPath);
      return;
    }

    const videoPath = resolveStoredPath(video.videoPath);

    if (!fs.existsSync(videoPath)) {
      return response.status(404).json({
        message: "Stored video file is missing.",
      });
    }

    const { size: fileSize } = fs.statSync(videoPath);
    const rangeHeader = request.headers.range;
