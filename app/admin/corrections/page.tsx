import Link from "next/link";
import { Badge, PageHeader } from "@/components/ui";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminCorrectionsPage() {
  const corrections = await prisma.reviewVerification.findMany({
    where: { status: "incorrect" },
    include: { correctedCategory: true, call: { include: { user: true, report: { include: { category: true } } } }, user: true },
    orderBy: { updatedAt: "desc" }
  });

  return (
    <>
      <PageHeader title="Corrections" subtitle="Reviewer feedback where AI output was marked incorrect." />
      <div className="overflow-x-auto rounded-lg border border-white/10">
        <table className="w-full text-sm">
          <thead className="bg-white/5 text-left text-slate-400"><tr><th className="p-4">Call</th><th>Original</th><th>Corrected</th><th>Reviewer</th><th>Feedback</th></tr></thead>
          <tbody>
            {corrections.map((verification) => (
              <tr key={verification.id} className="border-t border-white/5">
                <td className="p-4"><Link className="text-cyan-200" href={`/admin/calls/${verification.callId}`}>{verification.call.title}</Link><p className="text-xs text-slate-500">{verification.call.user.email}</p></td>
                <td>{verification.call.report?.category.name || "-"}</td>
                <td><Badge tone="danger">{verification.correctedCategory?.name || "Unspecified"}</Badge></td>
                <td>{verification.user.email}</td>
                <td className="max-w-lg text-slate-300">{verification.feedback || "-"}</td>
              </tr>
            ))}
            {!corrections.length ? <tr><td colSpan={5} className="p-8 text-center text-slate-400">No corrections have been submitted yet.</td></tr> : null}
          </tbody>
        </table>
      </div>
    </>
  );
}
