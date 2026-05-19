import Link from "next/link";
import { Activity, Mail, MapPin, MessageCircle, Phone, ShieldCheck, Twitter, Linkedin, Github } from "lucide-react";

const groups = [
  { title: "Product", links: [["Services", "/services"], ["How It Works", "/how-it-works"], ["Pricing", "/pricing"], ["Live Demo", "/transcription-demo"]] },
  { title: "Company", links: [["Reviews", "/reviews"], ["Privacy Policy", "/privacy"], ["Terms of Service", "/terms"], ["Security", "/security"]] },
  { title: "Support", links: [["Login", "/login"], ["Register", "/register"], ["Contact Us", "mailto:callaudtix@gmail.com"], ["Dashboard", "/dashboard"]] }
];

const badges = ["SOC 2 Type II", "HIPAA Ready", "End-to-End Encrypted", "GDPR Compliant"];

export function PublicFooter() {
  return (
    <footer className="border-t border-[#D8E1EE] bg-[#0F172A]">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[1.3fr_2fr] lg:px-8">
        <div>
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl border border-[#2563EB]/30 bg-[#2563EB]/15 text-[#60A5FA]">
              <Activity className="h-5 w-5" />
            </span>
            <div>
              <span className="block text-lg font-bold text-white">CallAudit X</span>
              <span className="block text-xs font-medium text-[#94A3B8]">AI call auditing SaaS</span>
            </div>
          </div>
          <p className="mt-5 max-w-sm text-sm leading-6 text-[#94A3B8]">
            Turn high-volume call recordings into transcripts, audit reports, scorecards, verification workflows, and performance analytics.
          </p>

          <div className="mt-6 space-y-3 text-sm text-[#94A3B8]">
            <a href="mailto:callaudtix@gmail.com" className="flex items-center gap-2 hover:text-white transition">
              <Mail className="h-4 w-4 text-[#60A5FA]" />
              callaudtix@gmail.com
            </a>
            <a href="tel:+15127616455" className="flex items-center gap-2 hover:text-white transition">
              <Phone className="h-4 w-4 text-[#60A5FA]" />
              (512) 761-6455
            </a>
            <a href="https://wa.me/16472574238" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-white transition">
              <MessageCircle className="h-4 w-4 text-[#60A5FA]" />
              WhatsApp: (647) 257-4238
            </a>
            <p className="flex items-start gap-2">
              <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-[#60A5FA]" />
              <span>5900 Balcones Dr Ste 13273<br />Austin, TX 78731</span>
            </p>
          </div>

          <div className="mt-6">
            <div className="rounded-xl border border-[#1E3A5F] bg-[#0D2137] p-3">
              <p className="text-xs font-semibold text-[#60A5FA] mb-2">Office Location</p>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3441.856894540987!2d-97.75765208505506!3d30.369873981751235!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8644cae4826e7c21%3A0x5b8f09c7b7a2f7bc!2s5900%20Balcones%20Dr%2C%20Austin%2C%20TX%2078731!5e0!3m2!1sen!2sus!4v1715966400000!5m2!1sen!2sus"
                width="100%"
                height="120"
                className="rounded-lg border border-[#1E3A5F]"
                loading="lazy"
                title="CallAudit X Office Location"
              />
            </div>
          </div>
        </div>

        <div className="grid gap-8 sm:grid-cols-3">
          {groups.map((group) => (
            <div key={group.title}>
              <h3 className="font-semibold text-white">{group.title}</h3>
              <div className="mt-4 space-y-3">
                {group.links.map(([label, href]) => (
                  <Link key={label} href={href} className="block text-sm text-[#94A3B8] transition hover:text-white">
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trust badges */}
      <div className="border-t border-[#1E293B] bg-[#0A0F1E]">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-4">
            {badges.map((badge) => (
              <div key={badge} className="flex items-center gap-1.5 rounded-full border border-[#1E3A5F] bg-[#0D2137] px-3 py-1.5 text-xs font-semibold text-[#60A5FA]">
                <ShieldCheck className="h-3.5 w-3.5" />
                {badge}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 border-t border-[#1E293B] px-4 py-5 text-sm text-[#64748B] sm:flex-row sm:px-6 lg:px-8">
        <p>&copy; 2026 CallAudit X. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-white transition">
            <Twitter className="h-4 w-4" />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-white transition">
            <Linkedin className="h-4 w-4" />
          </a>
          <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-white transition">
            <Github className="h-4 w-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}
