"use client";

import { Copy, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui";

interface TranscriptLine {
  timestamp: string;
  speaker: "Agent" | "Customer";
  text: string;
}

type TranscriptInput = TranscriptLine[] | string | null | undefined | Record<string, unknown>;

interface TranscriptViewerProps {
  lines: TranscriptInput;
  keywords?: string[];
  highlightedKeywords?: string[];
  onKeywordClick?: (keyword: string) => void;
}

function speakerName(value: unknown): "Agent" | "Customer" {
  return String(value || "Agent").toLowerCase().startsWith("customer") ? "Customer" : "Agent";
}

function normalizeLines(input: TranscriptInput): TranscriptLine[] {
  if (!input) return [];

  if (typeof input === "string") {
    return input
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line, idx) => {
        const match = line.match(/^(\d{1,2}:\d{2}(?::\d{2})?)\s*[-\u2013\u2014]\s*(Agent|Customer|Speaker\s*\d*)?:?\s*(.+)/i);
        if (match) {
          return {
            timestamp: match[1],
            speaker: speakerName(match[2]),
            text: match[3].trim()
          };
        }
        return { timestamp: `00:${String(idx).padStart(2, "0")}`, speaker: "Agent" as const, text: line };
      })
      .filter((line) => line.text.trim());
  }

  if (Array.isArray(input)) {
    return input
      .filter((item) => item && typeof item === "object")
      .map((item: any) => ({
        timestamp: String(item.timestamp || item.time || "00:00"),
        speaker: speakerName(item.speaker),
        text: String(item.text || item.content || "")
      }))
      .filter((line) => line.text.trim());
  }

  const objectInput = input as Record<string, unknown>;
  const candidate =
    objectInput.transcriptSegments ||
    objectInput.segments ||
    objectInput.lines ||
    objectInput.transcript ||
    objectInput.text ||
    null;

  return candidate ? normalizeLines(candidate as TranscriptInput) : [];
}

function highlightSegments(text: string, keywords: string[], onKeywordClick?: (kw: string) => void): React.ReactNode[] {
  if (!keywords.length) return [text];

  const escapedKeywords = keywords.map((keyword) => keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const regex = new RegExp(`(${escapedKeywords.join("|")})`, "gi");
  const parts = text.split(regex);

  return parts.map((part, i) => {
    if (keywords.some((keyword) => keyword.toLowerCase() === part.toLowerCase())) {
      return (
        <span
          key={i}
          className="cursor-pointer rounded bg-[#DBEAFE] px-0.5 font-semibold text-[#1D4ED8] hover:bg-[#BFDBFE]"
          onClick={() => onKeywordClick?.(part)}
        >
          {part}
        </span>
      );
    }
    return part;
  });
}

export function TranscriptViewer({ lines: rawLines, keywords = [], highlightedKeywords = [], onKeywordClick }: TranscriptViewerProps) {
  const lines = useMemo(() => normalizeLines(rawLines), [rawLines]);
  const [searchQuery, setSearchQuery] = useState("");
  const [copied, setCopied] = useState(false);

  const filteredLines = useMemo(() => {
    if (!searchQuery) return lines;
    const query = searchQuery.toLowerCase();
    return lines.filter((line) => line.text.toLowerCase().includes(query) || line.speaker.toLowerCase().includes(query));
  }, [lines, searchQuery]);

  function copyToClipboard() {
    const text = filteredLines.map((line) => `[${line.timestamp}] ${line.speaker}: ${line.text}`).join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const activeKeywords = highlightedKeywords.length > 0 ? highlightedKeywords : searchQuery ? [searchQuery] : [];

  if (!lines.length) {
    return (
      <div className="flex items-center justify-center rounded-xl border border-[#D8E1EE] bg-[#F5F7FB] py-12 text-sm text-[#64748B]">
        No transcript available
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />
          <input
            type="text"
            placeholder="Search transcript..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className="input pl-10"
          />
        </div>
        <button
          type="button"
          onClick={copyToClipboard}
          className="inline-flex items-center gap-2 rounded-lg border border-[#D8E1EE] bg-white px-3 py-2 text-sm font-medium text-[#2563EB] transition hover:bg-[#EFF6FF]"
        >
          <Copy className="h-4 w-4" />
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      <div className="rounded-xl border border-[#D8E1EE] bg-white p-5 shadow-sm">
        <div className="max-h-96 space-y-4 overflow-y-auto">
          {filteredLines.length > 0 ? (
            filteredLines.map((line, index) => (
              <div key={index} className="grid gap-3 border-b border-[#EEF3F9] pb-4 last:border-0 last:pb-0 md:grid-cols-[82px_104px_1fr]">
                <span className="font-mono text-xs text-[#94A3B8] md:pt-1">{line.timestamp}</span>
                <div>
                  <Badge tone={line.speaker === "Agent" ? "info" : "default"} size="sm">
                    {line.speaker}
                  </Badge>
                </div>
                <div className="min-w-0 text-sm leading-relaxed text-[#334155]">
                  {activeKeywords.length > 0 ? highlightSegments(line.text, activeKeywords, onKeywordClick) : line.text}
                </div>
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-sm text-[#94A3B8]">No results found for &ldquo;{searchQuery}&rdquo;</div>
          )}
        </div>
      </div>

      {keywords.length > 0 ? (
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">Keywords</p>
          <div className="flex flex-wrap gap-2">
            {keywords.map((keyword) => (
              <Badge key={keyword} tone="info" size="md">
                {keyword}
              </Badge>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
