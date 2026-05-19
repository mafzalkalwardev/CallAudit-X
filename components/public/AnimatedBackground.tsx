export function AnimatedBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#F5F7FB]">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#EEF3F9_0%,#F5F7FB_42%,#F5F7FB_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(37,99,235,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(37,99,235,0.04)_1px,transparent_1px)] bg-[size:76px_76px]" />
      <div className="absolute inset-x-0 top-0 h-56 bg-gradient-to-b from-[#2563EB]/5 via-[#0EA5E9]/3 to-transparent" />
    </div>
  );
}
