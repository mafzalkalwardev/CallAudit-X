export function AnimatedBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#030712]">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#07111F_0%,#030712_42%,#030712_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.045)_1px,transparent_1px)] bg-[size:76px_76px]" />
      <div className="absolute inset-x-0 top-0 h-56 bg-gradient-to-b from-[#22D3EE]/10 via-[#3B82F6]/5 to-transparent" />
      <div className="absolute inset-0 bg-[linear-gradient(110deg,transparent_0%,rgba(34,211,238,0.04)_24%,transparent_42%,rgba(59,130,246,0.04)_64%,transparent_100%)]" />
    </div>
  );
}
