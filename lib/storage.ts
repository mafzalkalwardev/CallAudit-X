import { mkdir, writeFile } from "fs/promises";
import path from "path";

const allowedTypes = new Set(["audio/mpeg", "audio/wav", "audio/x-wav", "audio/mp4", "audio/m4a", "audio/aac"]);
const maxSize = 50 * 1024 * 1024;

export type StoredAudio = {
  url: string;
  fileName: string;
  fileSize: number;
};

export async function saveAudio(file: File) {
  if (!allowedTypes.has(file.type) && !/\.(mp3|wav|m4a)$/i.test(file.name)) {
    throw new Error("Only mp3, wav, and m4a files are supported.");
  }
  if (file.size > maxSize) throw new Error("File exceeds the 50MB MVP limit.");

  const bytes = Buffer.from(await file.arrayBuffer());
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const storedName = `${Date.now()}-${safeName}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });
  await writeFile(path.join(uploadDir, storedName), bytes);
  return { url: `/uploads/${storedName}`, fileName: safeName, fileSize: file.size } satisfies StoredAudio;
}
