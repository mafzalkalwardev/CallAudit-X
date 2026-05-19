"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, Loader2 } from "lucide-react";
import { Card, Button } from "@/components/ui";
import { cn } from "@/lib/utils";

interface AudioReviewPlayerProps {
  src: string;
  fileName?: string;
  duration?: number;
}

export function AudioReviewPlayer({ src, fileName, duration }: AudioReviewPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [totalDuration, setTotalDuration] = useState(duration || 0);
  const [playbackRate, setPlaybackRate] = useState(1);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setTotalDuration(audio.duration);

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("play", () => setIsPlaying(true));
    audio.addEventListener("pause", () => setIsPlaying(false));

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("play", () => setIsPlaying(true));
      audio.removeEventListener("pause", () => setIsPlaying(false));
    };
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => setIsLoading(false));
    }
  };

  const formatTime = (time: number) => {
    if (!time || !isFinite(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handlePlaybackRateChange = (rate: number) => {
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
      setPlaybackRate(rate);
    }
  };

  return (
    <Card>
      <div className="space-y-4">
        {/* Audio element */}
        <audio ref={audioRef} src={src} onLoadStart={() => setIsLoading(true)} onCanPlay={() => setIsLoading(false)} crossOrigin="anonymous" />

        {/* File info */}
        {fileName && <p className="truncate text-xs font-medium text-[#64748B]">{fileName}</p>}

        {/* Main player */}
        <div className="space-y-3">
          {/* Play button & time display */}
          <div className="flex items-center gap-4">
            <Button
              onClick={togglePlay}
              variant="primary"
              size="md"
              disabled={isLoading}
              className="flex-shrink-0"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : isPlaying ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="h-5 w-5" />
              )}
            </Button>

            {/* Time display */}
            <div className="flex-1 text-center font-mono text-sm text-[#64748B]">
              <span>{formatTime(currentTime)}</span>
              <span className="mx-2">/</span>
              <span>{formatTime(totalDuration)}</span>
            </div>

            {/* Volume */}
            <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#D8E1EE] bg-white transition hover:bg-[#F5F7FB]">
              <Volume2 className="h-4 w-4 text-[#2563EB]" />
            </button>
          </div>

          {/* Progress bar */}
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="0"
              max={totalDuration || 0}
              value={currentTime}
              onChange={handleProgressChange}
              className="h-1.5 w-full cursor-pointer rounded-full bg-[#E2E8F0] accent-[#2563EB]"
            />
          </div>

          {/* Playback speed controls */}
          <div className="flex gap-2">
            {[0.75, 1, 1.25, 1.5].map((rate) => (
              <button
                key={rate}
                onClick={() => handlePlaybackRateChange(rate)}
                className={cn(
                  "rounded-lg border px-2.5 py-1.5 text-xs font-medium transition",
                  playbackRate === rate
                    ? "border-[#2563EB] bg-[#EFF6FF] text-[#2563EB]"
                    : "border-[#D8E1EE] text-[#64748B] hover:border-[#2563EB]/40 hover:text-[#2563EB]"
                )}
              >
                {rate}x
              </button>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
