"use client";

import { Search, Copy, CheckCircle2 } from "lucide-react";
import { useState, useMemo } from "react";
import { Card, Badge } from "@/components/ui";
import { cn } from "@/lib/utils";

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

/** Safely normalize whatever format the transcript data comes in as */
function normalizeLines(input: TranscriptInput): TranscriptLine[] {
  if (!input) return [];
  if (typeof input === "string") {
    // Parse "HH:MM:SS - Speaker: text" format
    return input
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line, idx) => {
        const match = line.match(/^(\d{1,2}:\d{2}(?::\d{2})?)\s*[-–]\s*(Agent|Customer|Speaker\s*\d*)?:?\s*(.+)/i);
        if (match) {
          const speaker = (match[2] || "Agent").trim();
          return {
            timestamp: match[1],
            speaker: speaker.toLowerCase().startsWith("customer") ? ("Customer" as const) : ("Agent" as const),
            text: match[3].trim()
          };
        }
        return { timestamp: `00:${String(idx).padStart(2, "0")}`, speaker: "Agent" as const, text: line };
      });
  }
  if (Array.isArray(input)) {
    return input
      .filter((item) => item && typeof item === "object")
      .map((item: any) => ({
        timestamp: String(item.timestamp || item.time || "00:00"),
        speaker: String(item.speaker || "Agent").toLowerCase().startsWith("customer") ? ("Customer" as const) : ("Agent" as const),
        text: String(item.text || item.content || "")
      }));
  }
  return [];
}

/** Highlight keywords in text and return React nodes */
function highlightSegments(text: string, keywords: string[], onKeywordClick?: (kw: string) => void): React.ReactNode[] {
  if (!keywords.length) return [text];

  const escapedKeywords = keywords.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const regex = new RegExp(`(${escapedKeywords.join("|")})`, "gi");
  const parts = text.split(regex);

  return parts.map((part, i) => {
    if (keywords.some((k) => k.toLowerCase() === part.toLowerCase())) {
      return (
        <span
          key={i}
          className="bg-[#DBEAFE] font-semibold text-[#1D4ED8] cursor-pointer rounded px-0.5 hover:bg-[#BFDBFE]"
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

  const copyToClipboard = () => {
    const text = filteredLines.map((line) => `[${line.timestamp}] ${line.speaker}: ${line.text}`).join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
      {/* Search and controls */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />
          <input
            type="text"
            placeholder="Search transcript..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input pl-10"
          />
        </div>
        <button
          onClick={copyToClipboard}
          className="inline-flex items-center gap-2 rounded-lg border border-[#D8E1EE] bg-white px-3 py-2 text-sm font-medium text-[#2563EB] transition hover:bg-[#EFF6FF]"
        >
          <Copy className="h-4 w-4" />
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>

      {/* Transcript */}
      <Card>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {filteredLines.length > 0 ? (
            filteredLines.map((line, index) => (
              <div key={index} className="flex gap-4 border-b border-[#EEF3F9] pb-4 last:border-0 last:pb-0">
                {/* Timestamp */}
                <div className="flex-shrink-0">
                  <span className="font-mono text-xs text-[#94A3B8]">{line.timestamp}</span>
                </div>

                {/* Speaker badge */}
                <div className="flex-shrink-0 pt-0.5">
                  <Badge tone={line.speaker === "Agent" ? "info" : "default"} size="sm">
                    {line.speaker}
                  </Badge>
                </div>

                {/* Text */}
                <div className="flex-1 text-sm leading-relaxed text-[#334155]">
                  {activeKeywords.length > 0
                    ? highlightSegments(line.text, activeKeywords, onKeywordClick)
                    : line.text}
                </div>
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-sm text-[#94A3B8]">No results found for &ldquo;{searchQuery}&rdquo;</div>
          )}
        </div>
      </Card>

      {/* Keywords */}
      {keywords.length > 0 && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8] mb-2">Keywords</p>
          <div className="flex flex-wrap gap-2">
            {keywords.map((keyword) => (
              <Badge key={keyword} tone="info" size="md">
                {keyword}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
