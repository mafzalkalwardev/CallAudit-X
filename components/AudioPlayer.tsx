export function AudioPlayer({ src }: { src: string }) {
  return <audio controls className="w-full rounded-md" src={src}>Your browser does not support audio playback.</audio>;
}
