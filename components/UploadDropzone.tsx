"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CheckCircle2, ExternalLink, FileAudio, Loader2, UploadCloud, XCircle } from "lucide-react";
import { Button, Card } from "@/components/ui";

type QueueItem = {
  key: string;
  file: File;
  callId?: string;
  status: "ready" | "uploading" | "queued" | "transcribing" | "analyzing" | "completed" | "failed";
  error?: string;
};

const statusLabel: Record<QueueItem["status"], string> = {
  ready: "Ready",
  uploading: "Uploading",
  queued: "Queued",
  transcribing: "Transcribing",
  analyzing: "Analyzing",
  completed: "Completed",
  failed: "Failed"
};

function fileKey(file: File) {
  return `${file.name}-${file.size}-${file.lastModified}`;
}

export function UploadDropzone() {
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const totalSize = useMemo(() => queue.reduce((sum, item) => sum + item.file.size, 0), [queue]);

  function updateItem(key: string, patch: Partial<QueueItem>) {
    setQueue((items) => items.map((item) => (item.key === key ? { ...item, ...patch } : item)));
  }

  function selectFiles(files: FileList | null) {
    if (!files?.length) return;
    const next = Array.from(files).map((file) => ({ key: fileKey(file), file, status: "ready" as const }));
    setQueue((current) => {
      const existing = new Set(current.map((item) => item.key));
      return [...current, ...next.filter((item) => !existing.has(item.key))];
    });
    setError("");
  }

  async function uploadAndAnalyze(formData: FormData) {
    if (!queue.length) {
      setError("Choose at least one audio file.");
      return;
    }

    setBusy(true);
    setError("");
    const uploadData = new FormData();
    for (const item of queue) {
      uploadData.append("audio", item.file);
      updateItem(item.key, { status: "uploading", error: undefined });
    }
    for (const [key, value] of formData.entries()) {
      if (key !== "audio") uploadData.append(key, value);
    }

    try {
      const response = await fetch("/api/calls/upload", { method: "POST", body: uploadData });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Upload failed.");

      const uploadedCalls = payload.calls as { callId: string; fileName: string }[];
      for (let index = 0; index < uploadedCalls.length; index++) {
        const uploaded = uploadedCalls[index];
        const item = queue[index];
        if (!item) continue;
        updateItem(item.key, { callId: uploaded.callId, status: "queued" });
      }

      for (let index = 0; index < uploadedCalls.length; index++) {
        const uploaded = uploadedCalls[index];
        const item = queue[index];
        if (!item) continue;
        updateItem(item.key, { status: "transcribing" });
        await new Promise((resolve) => setTimeout(resolve, 250));
        updateItem(item.key, { status: "analyzing" });
        const analyzeResponse = await fetch(`/api/ai/analyze/${uploaded.callId}`, { method: "POST" });
        const analyzePayload = await analyzeResponse.json();
        if (!analyzeResponse.ok) throw new Error(analyzePayload.error || `Analysis failed for ${item.file.name}.`);
        updateItem(item.key, { status: "completed" });
      }
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : "Upload or analysis failed.";
      setError(message);
      setQueue((items) => items.map((item) => (["completed"].includes(item.status) ? item : { ...item, status: "failed", error: message })));
    } finally {
      setBusy(false);
    }
  }

  return (
    <form action={uploadAndAnalyze} className="grid gap-5 xl:grid-cols-[1fr_400px]">
      <Card className="relative flex min-h-[420px] flex-col items-center justify-center overflow-hidden border-dashed p-8 text-center">
        <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-sky-300/45 to-transparent" />
        <div className="mb-4 grid h-16 w-16 place-items-center rounded-xl border border-sky-300/20 bg-sky-300/10">
          <UploadCloud className="h-8 w-8 text-sky-300" />
        </div>
        <h2 className="text-xl font-semibold text-slate-50">Bulk audio intake</h2>
        <p className="mt-2 max-w-md text-sm leading-6 text-slate-400">
          Upload mp3, wav, m4a, ogg, or webm files. Each recording is stored locally, queued, transcribed, audited, and linked to a review workspace.
        </p>
        <label className="mt-7 block w-full max-w-lg cursor-pointer rounded-xl border border-white/10 bg-slate-950/70 p-5 transition hover:border-sky-300/50 hover:bg-slate-900/80">
          <input className="sr-only" name="audio" type="file" accept=".mp3,.wav,.m4a,.ogg,.webm,audio/*,video/webm" multiple onChange={(event) => selectFiles(event.target.files)} />
          <span className="flex items-center justify-center gap-3 text-sm text-slate-300">
            <FileAudio className="h-5 w-5 text-sky-300" />
            Choose audio files
          </span>
          <span className="mt-2 block text-xs text-slate-500">Maximum 50MB per file</span>
        </label>

        <div className="mt-7 w-full max-w-2xl space-y-3 text-left">
          {queue.map((item) => (
            <div key={item.key} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate font-medium text-slate-100">{item.file.name}</p>
                  <p className="mt-1 text-xs text-slate-500">{(item.file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                <span className={`inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-medium ${item.status === "completed" ? "border-emerald-300/30 bg-emerald-300/10 text-emerald-100" : item.status === "failed" ? "border-rose-300/30 bg-rose-300/10 text-rose-100" : "border-sky-300/25 bg-sky-300/10 text-sky-100"}`}>
                  {["uploading", "transcribing", "analyzing"].includes(item.status) ? <Loader2 className="h-3 w-3 animate-spin" /> : item.status === "failed" ? <XCircle className="h-3 w-3" /> : <CheckCircle2 className="h-3 w-3" />}
                  {statusLabel[item.status]}
                </span>
              </div>
              {item.callId && item.status === "completed" ? (
                <Link href={`/dashboard/calls/${item.callId}`} className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-cyan-200 hover:text-cyan-100">
                  Open Review
                  <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              ) : null}
              {item.error ? <p className="mt-2 text-xs text-rose-300">{item.error}</p> : null}
            </div>
          ))}
          {!queue.length ? <p className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-center text-sm text-slate-500">No files selected yet.</p> : null}
        </div>
      </Card>

      <Card className="space-y-4">
        <div>
          <h3 className="font-semibold text-slate-100">Call metadata</h3>
          <p className="mt-1 text-sm text-slate-400">Metadata is applied to every file in this batch.</p>
        </div>
        <input className="input" name="title" placeholder="Call title (single-file uploads)" />
        <input className="input" name="agentName" placeholder="Agent name" />
        <input className="input" name="campaignName" placeholder="Campaign name" />
        <select className="input" name="callType" defaultValue="Inbound">
          <option>Inbound</option>
          <option>Outbound</option>
          <option>Support</option>
          <option>Sales</option>
          <option>Voicemail</option>
        </select>
        <textarea className="input min-h-28" name="notes" placeholder="Notes" />
        <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3 text-xs text-slate-400">
          {queue.length} file{queue.length === 1 ? "" : "s"} selected, {(totalSize / 1024 / 1024).toFixed(2)} MB total
        </div>
        {error ? <p className="rounded-lg border border-rose-300/20 bg-rose-300/10 p-3 text-sm text-rose-100">{error}</p> : null}
        <Button className="w-full" disabled={busy || !queue.length}>
          {busy ? "Processing..." : "Upload and Analyze"}
        </Button>
      </Card>
    </form>
  );
}
