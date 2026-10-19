import "dotenv/config";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "node:crypto";
import sharp from "sharp";

const region = process.env.AWS_REGION;
const bucket = process.env.AWS_S3_BUCKET;

if (!region || !bucket) {
  throw new Error("AWS_REGION and AWS_S3_BUCKET are required");
}

// The SDK reads AWS credentials from the backend environment.
const s3 = new S3Client({ region });

export const uploadProfileImage = async (
  file: Express.Multer.File,
  userId: number,
): Promise<string> => {
  const buffer = await sharp(file.buffer, {
    limitInputPixels: 25_000_000,
  })
    .rotate()
    .resize(512, 512, {
      fit: "cover",
      withoutEnlargement: true,
    })
    .webp({ quality: 80 })
    .toBuffer();

  // A unique filename also prevents showing an old cached photo.
  const key = `profiles/${userId}/${randomUUID()}.webp`;

  await s3.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: buffer,
      ContentType: "image/webp",
    }),
  );

  return `/${key}`;
};