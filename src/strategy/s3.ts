import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";
import multer from "multer";
import multerS3 from "multer-s3";
import { createId } from "@paralleldrive/cuid2";
import dotenv from 'dotenv';

dotenv.config();

const whitelist = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
];

const s3 = new S3Client({
  region: "ap-southeast-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const uploadJeStagingUpload = multer({
  fileFilter: function (_, file, cb) {
    if (!whitelist.includes(file.mimetype)) {
      return cb(new Error("file is not allowed"));
    }

    cb(null, true);
  },
  storage: multerS3({
    s3: s3,
    bucket: "uploadjestagingbucket",
    metadata: function (_, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (_, file, cb) {
      cb(null, `${createId()}_${file.originalname}`);
    },
  }),
});

export const s3Strategy = {
  uploadJeStagingUpload,
};
