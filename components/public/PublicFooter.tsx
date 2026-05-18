import Link from "next/link";
import { Activity, Github, Linkedin, Mail, MapPin, Phone, Twitter } from "lucide-react";

const groups = [
  { title: "Product", links: [["Services", "/services"], ["How It Works", "/how-it-works"], ["Pricing", "/pricing"], ["Login", "/login"]] },
  { title: "Company", links: [["Reviews", "/reviews"], ["Customer Stories", "/reviews"], ["Security", "/services"], ["Contact", "mailto:hello@callauditx.com"]] },
  { title: "Platform", links: [["AI Transcripts", "/services"], ["Audit Scores", "/services"], ["Verification", "/how-it-works"], ["Analytics", "/services"]] }
];

export function PublicFooter() {
  return (
    <footer className="border-t border-[rgba(148,163,184,0.16)] bg-[#030712]">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[1.2fr_2fr] lg:px-8">
        <div>
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl border border-[#22D3EE]/30 bg-[#22D3EE]/10 text-[#22D3EE]">
              <Activity className="h-5 w-5" />
            </span>
            <div>
              <span className="block text-lg font-semibold text-[#F8FAFC]">CallAudit X</span>
              <span className="block text-xs font-medium text-[#94A3B8]">Premium AI call auditing SaaS</span>
            </div>
          </div>
          <p className="mt-5 max-w-sm text-sm leading-6 text-[#94A3B8]">
            Turn high-volume call recordings into transcripts, audit reports, scorecards, verification workflows, and performance analytics.
          </p>
          <div className="mt-6 space-y-3 text-sm text-[#94A3B8]">
            <p className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-[#22D3EE]" /> hello@callauditx.com
            </p>
            <p className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-[#22D3EE]" /> +1 (555) 014-2048
            </p>
            <p className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-[#22D3EE]" /> San Francisco, CA
            </p>
          </div>
        </div>

        <div className="grid gap-8 sm:grid-cols-3">
          {groups.map((group) => (
            <div key={group.title}>
              <h3 className="font-semibold text-[#F8FAFC]">{group.title}</h3>
              <div className="mt-4 space-y-3">
                {group.links.map(([label, href]) => (
                  <Link key={label} href={href} className="block text-sm text-[#94A3B8] transition hover:text-[#22D3EE]">
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 border-t border-[rgba(148,163,184,0.16)] px-4 py-6 text-sm text-[#94A3B8] sm:flex-row sm:px-6 lg:px-8">
        <p>&copy; 2026 CallAudit X. All rights reserved.</p>
        <div className="flex gap-4 text-[#94A3B8]">
          <Twitter className="h-4 w-4" />
          <Linkedin className="h-4 w-4" />
          <Github className="h-4 w-4" />
        </div>
      </div>
    </footer>
  );
}
