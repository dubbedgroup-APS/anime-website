import fs from "fs/promises";
import path from "path";

import {
  thumbnailStorageDir,
  videoStorageDir,
} from "./paths.js";
import { publicFilePath } from "./storage.js";

const sanitizeName = (name = "") =>
  name.replace(/[^a-zA-Z0-9-_]/g, "-").toLowerCase();

const getFileExtension = (originalName = "", mimeType = "") => {
  const directExtension = path.extname(originalName);

  if (directExtension) {
    return directExtension;
  }

  if (mimeType === "image/jpeg") {
    return ".jpg";
  }

  if (mimeType === "image/png") {
    return ".png";
  }

  if (mimeType === "video/mp4") {
    return ".mp4";
  }

  return "";
};

export const saveBufferLocally = async ({ file, type }) => {
  const extension = getFileExtension(file.originalname, file.mimetype);
  const baseName = sanitizeName(path.basename(file.originalname, extension));
  const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}-${baseName}${extension}`;
  const targetDirectory = type === "thumbnail" ? thumbnailStorageDir : videoStorageDir;

  await fs.writeFile(path.join(targetDirectory, fileName), file.buffer);

  return publicFilePath(type === "thumbnail" ? "thumbnails" : "videos", fileName);
};
