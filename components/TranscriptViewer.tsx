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

interface TranscriptViewerProps {
  lines: TranscriptLine[];
  keywords?: string[];
  highlightedKeywords?: string[];
  onKeywordClick?: (keyword: string) => void;
}

export function TranscriptViewer({ lines, keywords = [], highlightedKeywords = [], onKeywordClick }: TranscriptViewerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [copied, setCopied] = useState(false);

  const filteredLines = useMemo(() => {
    if (!searchQuery) return lines;
    const query = searchQuery.toLowerCase();
    return lines.filter((line) => line.text.toLowerCase().includes(query) || line.speaker.toLowerCase().includes(query));
  }, [lines, searchQuery]);

  const highlightText = (text: string) => {
    if (!searchQuery && highlightedKeywords.length === 0) return text;

    let highlighted = text;
    const toHighlight = searchQuery ? [searchQuery] : highlightedKeywords;

    toHighlight.forEach((keyword) => {
      const regex = new RegExp(`(${keyword})`, "gi");
      highlighted = highlighted.replace(regex, '<mark className="bg-primary/30 font-semibold">$1</mark>');
    });

    return highlighted;
  };

  const copyToClipboard = () => {
    const text = filteredLines.map((line) => `[${line.timestamp}] ${line.speaker}: ${line.text}`).join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Search and controls */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder="Search transcript..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input pl-10"
          />
        </div>
        <button onClick={copyToClipboard} className="inline-flex items-center gap-2 rounded-lg border border-slate-700/50 bg-slate-900/30 px-3 py-2 text-sm font-medium text-primary transition hover:bg-slate-900/50">
          <Copy className="h-4 w-4" />
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>

      {/* Transcript */}
      <Card>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {filteredLines.length > 0 ? (
            filteredLines.map((line, index) => (
              <div key={index} className="flex gap-4 border-b border-slate-800/30 pb-4 last:border-0 last:pb-0">
                {/* Timestamp */}
                <div className="flex-shrink-0">
                  <span className="font-mono text-xs text-muted">{line.timestamp}</span>
                </div>

                {/* Speaker badge */}
                <div className="flex-shrink-0 pt-0.5">
                  <Badge tone={line.speaker === "Agent" ? "info" : "default"} size="sm">
                    {line.speaker}
                  </Badge>
                </div>

                {/* Text */}
                <div className="flex-1 text-sm leading-relaxed text-slate-200">
                  {highlightedKeywords.length > 0 ? (
                    <span>
                      {highlightedKeywords.reduce((acc, keyword) => {
                        const regex = new RegExp(`(${keyword})`, "gi");
                        return acc.split(regex).map((part, i) => {
                          if (regex.test(part)) {
                            return (
                              <span key={i} className="bg-primary/30 font-semibold text-primary cursor-pointer hover:bg-primary/50" onClick={() => onKeywordClick?.(part)}>
                                {part}
                              </span>
                            );
                          }
                          return part;
                        });
                      }, line.text)}
                    </span>
                  ) : (
                    line.text
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-sm text-soft">No results found for "{searchQuery}"</div>
          )}
        </div>
      </Card>

      {/* Keywords */}
      {keywords.length > 0 && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-2">Keywords</p>
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
