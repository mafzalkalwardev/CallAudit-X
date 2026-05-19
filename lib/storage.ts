import { mkdir, writeFile } from "fs/promises";
import path from "path";

const allowedExtensions = new Set([".mp3", ".wav", ".m4a", ".ogg", ".webm"]);
const allowedTypes = new Set([
  "audio/mpeg",
  "audio/mp3",
  "audio/wav",
  "audio/x-wav",
  "audio/mp4",
  "audio/m4a",
  "audio/aac",
  "audio/ogg",
  "audio/webm",
  "video/webm"
]);

export const MAX_AUDIO_SIZE = 50 * 1024 * 1024;
export const CALL_UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "calls");

export type StoredAudio = {
  url: string;
  fileName: string;
  storedFileName: string;
  fileSize: number;
  absolutePath: string;
};

function extensionFor(file: File) {
  return path.extname(file.name).toLowerCase();
}

export function isSupportedAudio(file: File) {
  const extension = extensionFor(file);
  return allowedExtensions.has(extension) || allowedTypes.has(file.type);
}

export function validateAudio(file: File) {
  if (!isSupportedAudio(file)) {
    throw new Error("Only mp3, wav, m4a, ogg, and webm audio files are supported.");
  }
  if (file.size > MAX_AUDIO_SIZE) {
    throw new Error("File exceeds the 50MB MVP limit.");
  }
}

export function publicAudioPath(audioUrl: string) {
  const relativePath = audioUrl.replace(/^\/+/, "").replace(/\//g, path.sep);
  return path.join(process.cwd(), "public", relativePath);
}

export async function saveAudio(file: File) {
  validateAudio(file);

  const bytes = Buffer.from(await file.arrayBuffer());
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const extension = extensionFor(file) || ".wav";
  const baseName = path.basename(safeName, path.extname(safeName));
  const storedFileName = `${Date.now()}-${crypto.randomUUID()}-${baseName}${extension}`;

  await mkdir(CALL_UPLOAD_DIR, { recursive: true });
  const absolutePath = path.join(CALL_UPLOAD_DIR, storedFileName);
  await writeFile(absolutePath, bytes);

  return {
    url: `/uploads/calls/${storedFileName}`,
    fileName: safeName,
    storedFileName,
    fileSize: file.size,
    absolutePath
  } satisfies StoredAudio;
}
