"use client";

import { useMemo, useState } from "react";
import { Plus, Save, Trash2, Users } from "lucide-react";
import { Badge, Button, Card, PageHeader, StatCard } from "@/components/ui";

type PlanOption = {
  id: string;
  name: string;
  price: number;
  monthlyCallLimit: number;
};

type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: "CUSTOMER" | "ADMIN";
  planId: string | null;
  subscriptionStatus: string;
  createdAt: string | Date;
  plan: PlanOption | null;
  _count: { calls: number; payments: number };
};

const statuses = ["active", "inactive", "trialing", "past_due", "canceled"];

export function AdminCustomersManager({ initialUsers, plans }: { initialUsers: AdminUser[]; plans: PlanOption[] }) {
  const [users, setUsers] = useState<AdminUser[]>(initialUsers);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busyId, setBusyId] = useState("");
  const [createOpen, setCreateOpen] = useState(false);

  const stats = useMemo(() => {
    return {
      total: users.length,
      customers: users.filter((user) => user.role === "CUSTOMER").length,
      active: users.filter((user) => user.subscriptionStatus === "active").length
    };
  }, [users]);

  async function refreshUsers() {
    const response = await fetch("/api/admin/users", { cache: "no-store" });
    const data = await response.json();
    if (response.ok) setUsers(data.users || []);
  }

  async function createUser(formData: FormData) {
    setError("");
    setMessage("");
    const payload = Object.fromEntries(formData.entries());
    const response = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error || "Unable to create user.");
      return;
    }
    setMessage("User created.");
    setCreateOpen(false);
    await refreshUsers();
  }

  async function updateUser(formData: FormData) {
    const id = String(formData.get("id") || "");
    setBusyId(id);
    setError("");
    setMessage("");
    const payload = Object.fromEntries(formData.entries());
    if (!payload.password) delete payload.password;
    const response = await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    setBusyId("");
    if (!response.ok) {
      setError(data.error || "Unable to update user.");
      return;
    }
    setMessage("User updated.");
    await refreshUsers();
  }

  async function deleteUser(id: string) {
    if (!window.confirm("Delete this user and all related calls, verifications, and payments?")) return;
    setBusyId(id);
    setError("");
    setMessage("");
    const response = await fetch(`/api/admin/users?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    const data = await response.json();
    setBusyId("");
    if (!response.ok) {
      setError(data.error || "Unable to delete user.");
      return;
    }
    setMessage("User deleted.");
    setUsers((current) => current.filter((user) => user.id !== id));
  }

  return (
    <>
      <PageHeader
        title="Customers"
        subtitle="View, create, edit, activate, deactivate, and manage plan access for CallAudit X users."
        action={
          <Button type="button" onClick={() => setCreateOpen((open) => !open)}>
            <Plus className="h-4 w-4" />
            Create user
          </Button>
        }
      />

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <StatCard title="Total users" value={stats.total} icon={Users} />
        <StatCard title="Customers" value={stats.customers} icon={Users} />
        <StatCard title="Active accounts" value={stats.active} icon={Users} />
      </div>

      {error ? <div className="mb-4 rounded-xl border border-[#DC2626]/20 bg-[#FEF2F2] p-3 text-sm font-semibold text-[#DC2626]">{error}</div> : null}
      {message ? <div className="mb-4 rounded-xl border border-[#16A34A]/20 bg-[#F0FDF4] p-3 text-sm font-semibold text-[#15803D]">{message}</div> : null}

      {createOpen ? (
        <Card className="mb-6">
          <h2 className="mb-4 font-bold text-[#0F172A]">Create User</h2>
          <form action={createUser} className="grid gap-3 lg:grid-cols-6">
            <input className="input" name="name" placeholder="Full name" required />
            <input className="input" name="email" type="email" placeholder="Email" required />
            <input className="input" name="password" type="password" placeholder="Temp password" required />
            <select className="input" name="role" defaultValue="CUSTOMER">
              <option value="CUSTOMER">Customer</option>
              <option value="ADMIN">Admin</option>
            </select>
            <select className="input" name="planId" defaultValue={plans[0]?.id || ""}>
              <option value="">No plan</option>
              {plans.map((plan) => <option key={plan.id} value={plan.id}>{plan.name}</option>)}
            </select>
            <select className="input" name="subscriptionStatus" defaultValue="active">
              {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
            </select>
            <Button className="lg:col-span-6 w-full md:w-fit">
              <Save className="h-4 w-4" />
              Save user
            </Button>
          </form>
        </Card>
      ) : null}

      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1120px] text-sm">
            <thead className="border-b border-[#EEF3F9] bg-[#F5F7FB] text-left text-xs uppercase tracking-wider text-[#64748B]">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Plan</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Usage</th>
                <th className="px-4 py-3">Joined</th>
                <th className="px-4 py-3">New password</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EEF3F9]">
              {users.map((user) => (
                <tr key={user.id} className="align-top hover:bg-[#F5F7FB]">
                  <td className="px-4 py-3">
                    <form id={`user-${user.id}`} action={updateUser} className="contents">
                      <input type="hidden" name="id" value={user.id} />
                      <input className="input min-w-36" name="name" defaultValue={user.name} required />
                    </form>
                  </td>
                  <td className="px-4 py-3">
                    <input form={`user-${user.id}`} className="input min-w-56" name="email" type="email" defaultValue={user.email} required />
                  </td>
                  <td className="px-4 py-3">
                    <select form={`user-${user.id}`} className="input min-w-32" name="role" defaultValue={user.role}>
                      <option value="CUSTOMER">Customer</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <select form={`user-${user.id}`} className="input min-w-36" name="planId" defaultValue={user.planId || ""}>
                      <option value="">No plan</option>
                      {plans.map((plan) => <option key={plan.id} value={plan.id}>{plan.name}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <select form={`user-${user.id}`} className="input min-w-32" name="subscriptionStatus" defaultValue={user.subscriptionStatus}>
                      {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
                    </select>
                    <Badge className="mt-2" tone={user.subscriptionStatus === "active" ? "success" : user.subscriptionStatus === "inactive" ? "danger" : "warn"}>
                      {user.subscriptionStatus}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-[#64748B]">
                    <p>{user._count.calls} calls</p>
                    <p>{user._count.payments} payments</p>
                  </td>
                  <td className="px-4 py-3 text-xs text-[#64748B]">{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <input form={`user-${user.id}`} className="input min-w-40" name="password" type="password" placeholder="Leave unchanged" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Button form={`user-${user.id}`} size="sm" disabled={busyId === user.id}>
                        <Save className="h-3.5 w-3.5" />
                        Save
                      </Button>
                      <button
                        type="button"
                        onClick={() => deleteUser(user.id)}
                        disabled={busyId === user.id}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-[#DC2626]/20 bg-white px-3 py-1.5 text-xs font-semibold text-[#DC2626] hover:bg-[#FEF2F2] disabled:opacity-50"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!users.length ? (
            <div className="p-12 text-center text-sm text-[#64748B]">No users found.</div>
          ) : null}
        </div>
      </Card>
    </>
  );
}
