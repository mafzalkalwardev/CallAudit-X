import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Role } from "@prisma/client";
import { Palette, Plus, Save, Trash2 } from "lucide-react";
import { Badge, Card, PageHeader } from "@/components/ui";
import { defaultCategories } from "@/lib/categories";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

async function requireAdmin() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== Role.ADMIN) redirect("/dashboard");
}

async function createCategory(formData: FormData) {
  "use server";
  await requireAdmin();
  try {
    await prisma.category.create({
      data: {
        name: String(formData.get("name") || "").trim(),
        description: String(formData.get("description") || "").trim(),
        color: String(formData.get("color") || "#2563EB"),
        icon: String(formData.get("icon") || "Tags").trim() || "Tags"
      }
    });
  } catch {
    // DB not available
  }
  revalidatePath("/admin/categories");
}

async function updateCategory(formData: FormData) {
  "use server";
  await requireAdmin();
  const id = String(formData.get("id"));
  try {
    await prisma.category.update({
      where: { id },
      data: {
        name: String(formData.get("name") || "").trim(),
        description: String(formData.get("description") || "").trim(),
        color: String(formData.get("color") || "#2563EB"),
        icon: String(formData.get("icon") || "Tags").trim() || "Tags"
      }
    });
  } catch {
    // DB not available
  }
  revalidatePath("/admin/categories");
}

async function deleteCategory(formData: FormData) {
  "use server";
  await requireAdmin();
  const id = String(formData.get("id"));
  try {
    const reportCount = await prisma.aIReport.count({ where: { categoryId: id } });
    const correctionCount = await prisma.reviewVerification.count({ where: { correctedCategoryId: id } });
    if (reportCount || correctionCount) return;
    await prisma.category.delete({ where: { id } });
  } catch {
    // DB not available
  }
  revalidatePath("/admin/categories");
}

async function restoreDefaults() {
  "use server";
  await requireAdmin();
  try {
    for (const category of defaultCategories) {
      await prisma.category.upsert({ where: { name: category.name }, update: category, create: category });
    }
  } catch {
    // DB not available
  }
  revalidatePath("/admin/categories");
}

export default async function AdminCategoriesPage() {
  let categories: any[] = [];
  try {
    categories = await prisma.category.findMany({
      include: { _count: { select: { reports: true, correctedVerifications: true } } },
      orderBy: { name: "asc" }
    });
  } catch {
    // DB not available
  }

  return (
    <>
      <PageHeader title="Call Categories" subtitle="Manage the taxonomy used by AI reports, filters, charts, and customer corrections." />
      
      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <div className="space-y-4">
          {categories.map((category) => {
            const locked = (category._count?.reports || 0) + (category._count?.correctedVerifications || 0) > 0;
            return (
              <Card key={category.id} className="bg-white border border-[#D8E1EE]">
                <form action={updateCategory} className="grid gap-4 lg:grid-cols-[1fr_1.4fr_130px_120px_auto] lg:items-end">
                  <input type="hidden" name="id" value={category.id} />
                  <label className="text-sm font-semibold text-[#0F172A]">
                    Name
                    <input className="input mt-2" name="name" defaultValue={category.name} required />
                  </label>
                  <label className="text-sm font-semibold text-[#0F172A]">
                    Description
                    <input className="input mt-2" name="description" defaultValue={category.description} required />
                  </label>
                  <label className="text-sm font-semibold text-[#0F172A]">
                    Color
                    <input className="input mt-2 h-[46px]" name="color" type="color" defaultValue={category.color} />
                  </label>
                  <label className="text-sm font-semibold text-[#0F172A]">
                    Icon
                    <input className="input mt-2" name="icon" defaultValue={category.icon} />
                  </label>
                  <button className="inline-flex h-[46px] items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-4 font-bold text-white hover:bg-[#1D4ED8] transition shadow-sm">
                    <Save className="h-4 w-4" /> Save
                  </button>
                </form>
                
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#EEF3F9] pt-4">
                  <div className="flex flex-wrap gap-2">
                    <Badge>{category._count?.reports || 0} reports</Badge>
                    <Badge>{category._count?.correctedVerifications || 0} corrections</Badge>
                    {locked ? <Badge tone="warn">In use</Badge> : <Badge tone="success">Deletable</Badge>}
                  </div>
                  <form action={deleteCategory}>
                    <input type="hidden" name="id" value={category.id} />
                    <button disabled={locked} className="inline-flex items-center gap-2 rounded-xl border border-[#DC2626]/20 px-3 py-2 text-sm font-semibold text-[#DC2626] hover:bg-[#FEF2F2] disabled:cursor-not-allowed disabled:opacity-40 transition">
                      <Trash2 className="h-4 w-4" /> Delete
                    </button>
                  </form>
                </div>
              </Card>
            );
          })}
          {!categories.length && (
            <Card className="text-center p-12">
              <Palette className="mx-auto h-10 w-10 text-[#D8E1EE] mb-3" />
              <p className="font-semibold text-[#64748B]">No categories loaded</p>
              <p className="mt-1 text-sm text-[#94A3B8]">Click restore defaults to load the initial system taxonomy.</p>
            </Card>
          )}
        </div>

        <div className="space-y-4">
          <Card>
            <div className="mb-4 flex items-center gap-2">
              <Plus className="h-5 w-5 text-[#2563EB]" />
              <h2 className="font-bold text-[#0F172A]">Add category</h2>
            </div>
            <form action={createCategory} className="space-y-4">
              <input className="input" name="name" placeholder="Category name" required />
              <textarea className="input min-h-28" name="description" placeholder="Description" required />
              <div className="grid grid-cols-[1fr_120px] gap-3">
                <input className="input" name="icon" placeholder="Lucide icon name" defaultValue="Tags" />
                <input className="input h-[46px]" name="color" type="color" defaultValue="#2563EB" aria-label="Category color" />
              </div>
              <button className="w-full rounded-xl bg-[#2563EB] px-4 py-2.5 font-bold text-white hover:bg-[#1D4ED8] shadow-sm transition">Create category</button>
            </form>
          </Card>
          
          <Card>
            <Palette className="h-5 w-5 text-[#2563EB]" />
            <h2 className="mt-3 font-bold text-[#0F172A]">Default taxonomy</h2>
            <p className="mt-2 text-sm text-[#64748B]">Restore the 10 recommended CallAudit X categories without deleting custom categories.</p>
            <form action={restoreDefaults} className="mt-4">
              <button className="w-full rounded-xl border border-[#D8E1EE] bg-white px-4 py-2.5 text-sm font-semibold text-[#64748B] hover:bg-[#F5F7FB] transition">Restore defaults</button>
            </form>
          </Card>
        </div>
      </div>
    </>
  );
}
