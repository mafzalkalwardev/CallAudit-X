import Link from "next/link";
import { RefreshCcw } from "lucide-react";
import { Badge, Card, PageHeader } from "@/components/ui";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminCorrectionsPage() {
  let corrections: any[] = [];

  try {
    corrections = await prisma.reviewVerification.findMany({
      where: { status: "incorrect" },
      include: { correctedCategory: true, call: { include: { user: true, report: { include: { category: true } } } }, user: true },
      orderBy: { updatedAt: "desc" }
    });
  } catch {
    // DB not available
  }

  return (
    <>
      <PageHeader
        title="AI Corrections"
        subtitle="Reviewer feedback where AI output was marked incorrect. Use this to improve category accuracy over time."
      />

      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-[#EEF3F9] bg-[#F5F7FB]">
              <tr className="text-xs uppercase tracking-wider text-[#64748B]">
                <th className="px-5 py-4 text-left">Call</th>
                <th className="px-5 py-4 text-left">AI Said</th>
                <th className="px-5 py-4 text-left">Corrected To</th>
                <th className="px-5 py-4 text-left">Reviewer</th>
                <th className="px-5 py-4 text-left">Feedback</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EEF3F9]">
              {corrections.map((verification) => (
                <tr key={verification.id} className="transition hover:bg-[#F5F7FB]">
                  <td className="px-5 py-4">
                    <Link className="font-semibold text-[#2563EB] hover:text-[#1D4ED8]" href={`/admin/calls/${verification.callId}`}>
                      {verification.call.title}
                    </Link>
                    <p className="text-xs text-[#94A3B8]">{verification.call.user.email}</p>
                  </td>
                  <td className="px-5 py-4">
                    <Badge tone="warn">{verification.call.report?.category.name || "—"}</Badge>
                  </td>
                  <td className="px-5 py-4">
                    <Badge tone="danger">{verification.correctedCategory?.name || "Unspecified"}</Badge>
                  </td>
                  <td className="px-5 py-4 text-[#64748B]">{verification.user.email}</td>
                  <td className="max-w-xs px-5 py-4 text-xs text-[#64748B]">{verification.feedback || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {!corrections.length && (
            <div className="p-12 text-center">
              <RefreshCcw className="mx-auto h-10 w-10 text-[#D8E1EE] mb-3" />
              <p className="font-semibold text-[#64748B]">No corrections yet</p>
              <p className="mt-1 text-sm text-[#94A3B8]">Corrections appear when reviewers mark AI classifications as incorrect.</p>
            </div>
          )}
        </div>
      </Card>
    </>
  );
}
