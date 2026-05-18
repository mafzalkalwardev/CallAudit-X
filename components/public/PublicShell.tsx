import { AnimatedBackground } from "@/components/public/AnimatedBackground";
import { PublicFooter } from "@/components/public/PublicFooter";
import { PublicNavbar } from "@/components/public/PublicNavbar";

export function PublicShell({ children, footer = true }: { children: React.ReactNode; footer?: boolean }) {
  return (
    <>
      <AnimatedBackground />
      <PublicNavbar />
      {children}
      {footer ? <PublicFooter /> : null}
    </>
  );
}
