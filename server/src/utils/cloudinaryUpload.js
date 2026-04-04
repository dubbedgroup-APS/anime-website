import { Readable } from "stream";

import cloudinary, { isCloudinaryEnabled } from "../config/cloudinary.js";

const streamUpload = ({ buffer, folder, resourceType, publicId }) =>
  new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
        public_id: publicId,
        overwrite: true,
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(result);
      }
    );

    Readable.from(buffer).pipe(uploadStream);
  });

export const uploadVideoToCloudinary = async ({ file, publicId }) => {
  if (!isCloudinaryEnabled()) {
    throw new Error("Cloudinary is not configured.");
  }

  return streamUpload({
    buffer: file.buffer,
    folder: "viode/videos",
    resourceType: "video",
    publicId,
  });
};

export const uploadImageToCloudinary = async ({ file, publicId }) => {
  if (!isCloudinaryEnabled()) {
    throw new Error("Cloudinary is not configured.");
  }

  return streamUpload({
    buffer: file.buffer,
    folder: "viode/thumbnails",
    resourceType: "image",
    publicId,
  });
};

export const buildCloudinaryVideoThumbnail = (publicId) =>
  cloudinary.url(publicId, {
    resource_type: "video",
    format: "jpg",
    secure: true,
    transformation: [{ width: 1280, height: 720, crop: "fill" }],
  });
