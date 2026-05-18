"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, FileAudio, Loader2, UploadCloud } from "lucide-react";
import { Button, Card } from "@/components/ui";

export function UploadDropzone() {
  const router = useRouter();
  const [progress, setProgress] = useState("");
  const [error, setError] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const fileSize = useMemo(() => (file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : ""), [file]);

  async function submit(formData: FormData) {
    setError("");
    setProgress("Uploading audio and running AI review...");
    const response = await fetch("/api/calls/upload", { method: "POST", body: formData });
    if (!response.ok) {
      setError((await response.json()).error || "Upload failed");
      setProgress("");
      return;
    }
    const data = await response.json();
    router.push(`/dashboard/calls/${data.callId}`);
    router.refresh();
  }

  return (
    <form action={submit} className="grid gap-5 xl:grid-cols-[1fr_400px]">
      <Card className="relative flex min-h-[420px] flex-col items-center justify-center overflow-hidden border-dashed p-8 text-center">
        <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-sky-300/45 to-transparent" />
        <div className="mb-4 grid h-16 w-16 place-items-center rounded-xl border border-sky-300/20 bg-sky-300/10">
          <UploadCloud className="h-8 w-8 text-sky-300" />
        </div>
        <h2 className="text-xl font-semibold text-slate-50">Bulk-ready audio intake</h2>
        <p className="mt-2 max-w-md text-sm leading-6 text-slate-400">Add recorded calls to the audit queue. Each file is stored locally, analyzed with mock AI, and becomes available for replay and verification.</p>
        <label className="mt-7 block w-full max-w-lg cursor-pointer rounded-xl border border-white/10 bg-slate-950/70 p-5 transition hover:border-sky-300/50 hover:bg-slate-900/80">
          <input className="sr-only" name="audio" type="file" accept=".mp3,.wav,.m4a,audio/*" required onChange={(event) => setFile(event.target.files?.[0] || null)} />
          <span className="flex items-center justify-center gap-3 text-sm text-slate-300">
            <FileAudio className="h-5 w-5 text-sky-300" />
            {file ? file.name : "Choose audio file"}
          </span>
          {file ? <span className="mt-2 block text-xs text-slate-500">{fileSize}</span> : null}
        </label>
        {file ? <audio className="mt-5 w-full max-w-md" controls src={URL.createObjectURL(file)} /> : null}
        <div className="mt-7 grid w-full max-w-lg gap-3 text-left md:grid-cols-3">
          {["Validated file type", "Local storage adapter", "AI analysis queued"].map((item) => (
            <div key={item} className="rounded-lg border border-white/10 bg-white/[0.03] p-3 text-xs text-slate-400">
              <CheckCircle2 className="mb-2 h-4 w-4 text-emerald-300" />
              {item}
            </div>
          ))}
        </div>
      </Card>
      <Card className="space-y-4">
        <div>
          <h3 className="font-semibold text-slate-100">Call metadata</h3>
          <p className="mt-1 text-sm text-slate-400">These fields improve mock AI context and dashboard filters.</p>
        </div>
        <input className="input" name="title" placeholder="Call title" required />
        <input className="input" name="agentName" placeholder="Agent name" />
        <input className="input" name="campaignName" placeholder="Campaign name" />
        <select className="input" name="callType" defaultValue="Inbound">
          <option>Inbound</option><option>Outbound</option><option>Support</option><option>Sales</option><option>Voicemail</option>
        </select>
        <textarea className="input min-h-28" name="notes" placeholder="Notes" />
        {progress ? <div className="rounded-lg border border-sky-300/20 bg-sky-300/10 p-3"><p className="flex items-center gap-2 text-sm text-sky-100"><Loader2 className="h-4 w-4 animate-spin" />{progress}</p><div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-800"><div className="h-full w-2/3 animate-pulse rounded-full bg-sky-300" /></div></div> : null}
        {error ? <p className="text-sm text-rose-300">{error}</p> : null}
        <Button className="w-full" disabled={Boolean(progress)}>Upload and analyze</Button>
      </Card>
    </form>
  );
}
