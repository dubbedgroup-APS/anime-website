import multer from "multer";

const fileFilter = (_request, file, callback) => {
  if (file.fieldname === "video" && file.mimetype.startsWith("video/")) {
    callback(null, true);
    return;
  }

  if (file.fieldname === "thumbnail" && file.mimetype.startsWith("image/")) {
    callback(null, true);
    return;
  }

  callback(new Error(`Unsupported file type for ${file.fieldname}.`));
};

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 1024 * 1024 * 500,
  },
  fileFilter,
});

export const uploadVideoAssets = upload.fields([
  { name: "video", maxCount: 1 },
  { name: "thumbnail", maxCount: 1 },
]);
