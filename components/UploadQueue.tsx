"use client";

import { FileAudio, Loader2, Check, AlertCircle, Trash2 } from "lucide-react";
import { Card, Badge } from "@/components/ui";
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

interface StatusConfigItem {
  icon: any;
  color: string;
  bgColor: string;
  label: string;
  animate?: boolean;
}

export function UploadQueue({ items, onRetry, onRemove }: UploadQueueProps) {
  if (items.length === 0) {
    return null;
  }

  const statusConfig: Record<UploadItemStatus, StatusConfigItem> = {
    pending: { icon: FileAudio, color: "text-[#64748B]", bgColor: "bg-[#EFF6FF]", label: "Pending" },
    uploading: { icon: Loader2, color: "text-[#2563EB]", bgColor: "bg-[#EFF6FF]", label: "Uploading", animate: true },
    processing: { icon: Loader2, color: "text-[#0EA5E9]", bgColor: "bg-[#F0F9FF]", label: "Processing", animate: true },
    completed: { icon: Check, color: "text-[#15803D]", bgColor: "bg-[#F0FDF4]", label: "Completed" },
    failed: { icon: AlertCircle, color: "text-[#DC2626]", bgColor: "bg-[#FEF2F2]", label: "Failed" }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-3">
      <p className="text-sm font-semibold text-[#0F172A]">Upload Queue ({items.length})</p>
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {items.map((item) => {
          const config = statusConfig[item.status];
          const StatusIcon = config.icon;

          return (
            <Card key={item.id} className="p-4 bg-white border border-[#D8E1EE]">
              <div className="flex items-center justify-between gap-4">
                {/* Status icon */}
                <div className={cn("flex-shrink-0 rounded-lg p-2", config.bgColor)}>
                  <StatusIcon className={cn("h-4 w-4", config.color, config.animate && "animate-spin")} />
                </div>

                {/* File info */}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-[#0F172A]">{item.fileName}</p>
                  <div className="mt-1 flex items-center justify-between">
                    <p className="text-xs text-[#64748B]">{formatFileSize(item.fileSize)}</p>
                    {(item.status === "uploading" || item.status === "processing") && (
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-24 rounded-full bg-[#EFF6FF]">
                          <div className="h-full rounded-full bg-[#2563EB] transition-all" style={{ width: `${item.progress}%` }} />
                        </div>
                        <span className="text-xs text-[#64748B]">{item.progress}%</span>
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
                      type="button"
                      onClick={() => onRetry(item.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#D8E1EE] hover:bg-[#F5F7FB] transition"
                      title="Retry upload"
                    >
                      <Loader2 className="h-4 w-4 text-[#2563EB]" />
                    </button>
                  )}
                  {onRemove && (
                    <button
                      type="button"
                      onClick={() => onRemove(item.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#D8E1EE] hover:bg-[#FEF2F2] transition"
                      title="Remove from queue"
                    >
                      <Trash2 className="h-4 w-4 text-[#DC2626]" />
                    </button>
                  )}
                </div>
              </div>

              {/* Error message */}
              {item.error && (
                <div className="mt-3 rounded-xl border border-[#DC2626]/20 bg-[#FEF2F2] p-2">
                  <p className="text-xs font-medium text-[#DC2626]">{item.error}</p>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
