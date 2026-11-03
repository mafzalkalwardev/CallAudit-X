import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { PutObjectCommand, GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { put } from "@vercel/blob";

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
const MOCK_AUDIO_URL = "/sample-call.wav";

export type AudioStorageMode = "blob" | "s3" | "local" | "mock";

export type StoredAudio = {
  url: string;
  fileName: string;
  storedFileName: string;
  fileSize: number;
  absolutePath: string;
  storage: AudioStorageMode;
};

type PreparedAudio = {
  bytes: Buffer;
  fileName: string;
  storedFileName: string;
  fileSize: number;
  contentType: string;
};

function extensionFor(file: File) {
  return path.extname(file.name).toLowerCase();
}

function envValue(name: string) {
  const value = process.env[name]?.trim();
  return value ? value : undefined;
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

export function audioStorageMode(): AudioStorageMode {
  const requested = envValue("AUDIO_STORAGE")?.toLowerCase();
  if (requested === "blob" || requested === "s3" || requested === "local" || requested === "mock") {
    return requested;
  }
  if (envValue("BLOB_READ_WRITE_TOKEN")) return "blob";
  if (s3Config()) return "s3";
  if (envValue("VERCEL")) return "mock";
  return "local";
}

export function audioStorageLabel(mode = audioStorageMode()) {
  if (mode === "blob") return "Vercel Blob";
  if (mode === "s3") return "S3";
  if (mode === "local") return "Local";
  return "Mock";
}

export function publicAudioPath(audioUrl: string) {
  const relativePath = audioUrl.replace(/^\/+/, "").replace(/\//g, path.sep);
  return path.join(process.cwd(), "public", relativePath);
}

function fileNameFromUrl(audioUrl: string) {
  const tail = audioUrl.split("/").pop()?.split("?")[0] || "call.wav";
  try {
    return decodeURIComponent(tail);
  } catch {
    return tail;
  }
}

function s3Config() {
  const bucket = envValue("S3_BUCKET");
  const accessKeyId = envValue("S3_ACCESS_KEY_ID") || envValue("AWS_ACCESS_KEY_ID");
  const secretAccessKey = envValue("S3_SECRET_ACCESS_KEY") || envValue("AWS_SECRET_ACCESS_KEY");
  if (!bucket || !accessKeyId || !secretAccessKey) return null;
  return {
    bucket,
    accessKeyId,
    secretAccessKey,
    region: envValue("S3_REGION") || envValue("AWS_REGION") || "us-east-1",
    endpoint: envValue("S3_ENDPOINT"),
    publicBaseUrl: envValue("S3_PUBLIC_BASE_URL")?.replace(/\/$/, ""),
    forcePathStyle: envValue("S3_FORCE_PATH_STYLE") === "true"
  };
}

function s3Client(config: NonNullable<ReturnType<typeof s3Config>>) {
  return new S3Client({
    region: config.region,
    endpoint: config.endpoint,
    forcePathStyle: config.forcePathStyle || Boolean(config.endpoint),
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey
    }
  });
}

function requireS3Config() {
  const config = s3Config();
  if (!config) {
    throw new Error("S3 storage requires S3_BUCKET, S3_ACCESS_KEY_ID, and S3_SECRET_ACCESS_KEY.");
  }
  return config;
}

async function prepareAudio(file: File): Promise<PreparedAudio> {
  validateAudio(file);
  const bytes = Buffer.from(await file.arrayBuffer());
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const extension = extensionFor(file) || ".wav";
  const baseName = path.basename(safeName, path.extname(safeName)) || "call";
  const storedFileName = `${Date.now()}-${crypto.randomUUID()}-${baseName}${extension}`;
  return {
    bytes,
    fileName: safeName || `call${extension}`,
    storedFileName,
    fileSize: file.size,
    contentType: file.type || "application/octet-stream"
  };
}

function mockAudio(prepared: PreparedAudio): StoredAudio {
  return {
    url: MOCK_AUDIO_URL,
    fileName: prepared.fileName,
    storedFileName: prepared.storedFileName,
    fileSize: prepared.fileSize,
    absolutePath: publicAudioPath(MOCK_AUDIO_URL),
    storage: "mock"
  };
}

async function saveLocal(prepared: PreparedAudio): Promise<StoredAudio> {
  await mkdir(CALL_UPLOAD_DIR, { recursive: true });
  const absolutePath = path.join(CALL_UPLOAD_DIR, prepared.storedFileName);
  await writeFile(absolutePath, prepared.bytes);
  return {
    url: `/uploads/calls/${prepared.storedFileName}`,
    fileName: prepared.fileName,
    storedFileName: prepared.storedFileName,
    fileSize: prepared.fileSize,
    absolutePath,
    storage: "local"
  };
}

async function saveBlob(prepared: PreparedAudio): Promise<StoredAudio> {
  const token = envValue("BLOB_READ_WRITE_TOKEN");
  if (!token) {
    throw new Error("Vercel Blob storage requires BLOB_READ_WRITE_TOKEN.");
  }
  const blob = await put(`calls/${prepared.storedFileName}`, prepared.bytes, {
    access: "public",
    token,
    contentType: prepared.contentType
  });
  return {
    url: blob.url,
    fileName: prepared.fileName,
    storedFileName: prepared.storedFileName,
    fileSize: prepared.fileSize,
    absolutePath: "",
    storage: "blob"
  };
}

async function saveS3(prepared: PreparedAudio): Promise<StoredAudio> {
  const config = requireS3Config();
  const key = `calls/${prepared.storedFileName}`;
  await s3Client(config).send(
    new PutObjectCommand({
      Bucket: config.bucket,
      Key: key,
      Body: prepared.bytes,
      ContentType: prepared.contentType
    })
  );
  const url = config.publicBaseUrl
    ? `${config.publicBaseUrl}/${key}`
    : config.endpoint
      ? `${config.endpoint.replace(/\/$/, "")}/${config.bucket}/${key}`
      : `https://${config.bucket}.s3.${config.region}.amazonaws.com/${key}`;
  return {
    url,
    fileName: prepared.fileName,
    storedFileName: prepared.storedFileName,
    fileSize: prepared.fileSize,
    absolutePath: "",
    storage: "s3"
  };
}

export async function saveAudio(file: File) {
  const prepared = await prepareAudio(file);
  const mode = audioStorageMode();
  if (mode === "blob") return saveBlob(prepared);
  if (mode === "s3") return saveS3(prepared);
  if (mode === "mock") return mockAudio(prepared);
  try {
    return await saveLocal(prepared);
  } catch (error) {
    console.warn("Local audio storage is unavailable; falling back to mock storage.", error);
    return mockAudio(prepared);
  }
}

function s3KeyFromUrl(audioUrl: string, bucket: string) {
  const pathname = new URL(audioUrl).pathname.replace(/^\/+/, "");
  if (pathname.startsWith(`${bucket}/`)) return pathname.slice(bucket.length + 1);
  return pathname;
}

async function readFromS3(audioUrl: string) {
  const config = s3Config();
  if (!config || !/^https?:\/\//i.test(audioUrl)) return null;
  const key = s3KeyFromUrl(audioUrl, config.bucket);
  if (!key) return null;
  const response = await s3Client(config).send(new GetObjectCommand({ Bucket: config.bucket, Key: key }));
  if (!response.Body) return null;
  const bytes = await response.Body.transformToByteArray();
  return { data: Buffer.from(bytes), fileName: fileNameFromUrl(audioUrl) };
}

export async function readStoredAudio(audioUrl: string) {
  if (/^https?:\/\//i.test(audioUrl)) {
    try {
      const response = await fetch(audioUrl);
      if (response.ok) {
        return { data: Buffer.from(await response.arrayBuffer()), fileName: fileNameFromUrl(audioUrl) };
      }
    } catch (error) {
      console.warn(`Direct audio download failed for ${audioUrl}.`, error);
    }
    const fromS3 = await readFromS3(audioUrl);
    if (fromS3) return fromS3;
    throw new Error("Unable to download stored audio.");
  }

  const absolutePath = publicAudioPath(audioUrl);
  return { data: await readFile(absolutePath), fileName: path.basename(absolutePath) };
}
