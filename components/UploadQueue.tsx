"use client";

import { useState } from "react";
import { FileAudio, Loader2, Check, AlertCircle, X, Trash2 } from "lucide-react";
import { Card, Badge, Button } from "@/components/ui";
import { cn } from "@/lib/utils";

export type UploadItemStatus = "pending" | "uploading" | "processing" | "completed" | "failed";

export interface UploadItem {
  id: string;
  fileName: string;
  fileSize: number;
  status: UploadItemStatus;
  progress: number;
  error?: string;
}

interface UploadQueueProps {
  items: UploadItem[];
  onRetry?: (id: string) => void;
  onRemove?: (id: string) => void;
}

export function UploadQueue({ items, onRetry, onRemove }: UploadQueueProps) {
  if (items.length === 0) {
    return null;
  }

  const statusConfig = {
    pending: { icon: FileAudio, color: "text-muted", bgColor: "bg-slate-800/30", label: "Pending" },
    uploading: { icon: Loader2, color: "text-primary", bgColor: "bg-primary/10", label: "Uploading", animate: true },
    processing: { icon: Loader2, color: "text-secondary", bgColor: "bg-secondary/10", label: "Processing", animate: true },
    completed: { icon: Check, color: "text-success", bgColor: "bg-success/10", label: "Completed" },
    failed: { icon: AlertCircle, color: "text-danger", bgColor: "bg-danger/10", label: "Failed" }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-3">
      <p className="text-sm font-semibold text-slate-100">Upload Queue ({items.length})</p>
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {items.map((item) => {
          const config = statusConfig[item.status];
          const StatusIcon = config.icon;

          return (
            <Card key={item.id} className="p-4">
              <div className="flex items-center justify-between gap-4">
                {/* Status icon */}
                <div className={cn("flex-shrink-0 rounded-lg p-2", config.bgColor)}>
                  <StatusIcon className={cn("h-4 w-4", config.color, config.animate && "animate-spin")} />
                </div>

                {/* File info */}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-100">{item.fileName}</p>
                  <div className="mt-1 flex items-center justify-between">
                    <p className="text-xs text-soft">{formatFileSize(item.fileSize)}</p>
                    {(item.status === "uploading" || item.status === "processing") && (
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-24 rounded-full bg-slate-800/50">
                          <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${item.progress}%` }} />
                        </div>
                        <span className="text-xs text-muted">{item.progress}%</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Status badge */}
                <Badge tone={item.status === "completed" ? "success" : item.status === "failed" ? "danger" : "default"} size="sm">
                  {config.label}
                </Badge>

                {/* Actions */}
                <div className="flex gap-1 flex-shrink-0">
                  {item.status === "failed" && onRetry && (
                    <button
                      onClick={() => onRetry(item.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700/50 hover:bg-slate-800/30 transition"
                      title="Retry upload"
                    >
                      <Loader2 className="h-4 w-4 text-primary" />
                    </button>
                  )}
                  {onRemove && (
                    <button
                      onClick={() => onRemove(item.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700/50 hover:bg-danger/10 transition"
                      title="Remove from queue"
                    >
                      <Trash2 className="h-4 w-4 text-danger" />
                    </button>
                  )}
                </div>
              </div>

              {/* Error message */}
              {item.error && (
                <div className="mt-3 rounded-lg border border-danger/20 bg-danger/5 p-2">
                  <p className="text-xs text-danger">{item.error}</p>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
