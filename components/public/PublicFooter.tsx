import Link from "next/link";
import { Github, Linkedin, Mail, MapPin, Phone, Twitter } from "lucide-react";

const groups = [
  { title: "Product", links: [["Services", "/services"], ["How It Works", "/how-it-works"], ["Pricing", "/pricing"], ["Login", "/login"]] },
  { title: "Company", links: [["Reviews", "/reviews"], ["About", "/"], ["Careers", "/services"], ["Contact", "mailto:hello@callauditx.com"]] },
  { title: "Resources", links: [["AI Call Auditing", "/services"], ["Analytics", "/services"], ["QA Reports", "/services"], ["Support", "/login"]] }
];

export function PublicFooter() {
  return (
    <footer className="border-t border-white/10 bg-slate-950/70">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.2fr_2fr] lg:px-8">
        <div>
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-cyan-300 to-blue-600 text-sm font-black text-slate-950">CX</span>
            <span className="text-lg font-semibold text-white">CallAudit X</span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-6 text-slate-400">Premium AI call auditing, quality scoring, and conversation analytics for sales and support teams.</p>
          <div className="mt-6 space-y-3 text-sm text-slate-400">
            <p className="flex items-center gap-2"><Mail className="h-4 w-4 text-cyan-300" /> hello@callauditx.com</p>
            <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-cyan-300" /> +1 (555) 014-2048</p>
            <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-cyan-300" /> San Francisco, CA</p>
          </div>
        </div>
        <div className="grid gap-8 sm:grid-cols-3">
          {groups.map((group) => (
            <div key={group.title}>
              <h3 className="font-semibold text-white">{group.title}</h3>
              <div className="mt-4 space-y-3">
                {group.links.map(([label, href]) => <Link key={label} href={href} className="block text-sm text-slate-400 transition hover:text-cyan-200">{label}</Link>)}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 border-t border-white/10 px-4 py-6 text-sm text-slate-500 sm:flex-row sm:px-6 lg:px-8">
        <p>© 2026 CallAudit X. All rights reserved.</p>
        <div className="flex gap-4"><Twitter className="h-4 w-4" /><Linkedin className="h-4 w-4" /><Github className="h-4 w-4" /></div>
      </div>
    </footer>
  );
}
