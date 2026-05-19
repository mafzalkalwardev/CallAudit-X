"use client";

import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, RadialBar, RadialBarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card } from "@/components/ui";

const grid = "#E2E8F0";
const axis = "#94A3B8";
const palette = ["#2563EB", "#0EA5E9", "#14B8A6", "#F59E0B", "#DC2626", "#94A3B8", "#16A34A", "#7C3AED", "#0F766E", "#C2410C"];

function tooltipStyle() {
  return {
    background: "#FFFFFF",
    border: "1px solid #D8E1EE",
    borderRadius: 10,
    color: "#0F172A",
    boxShadow: "0 4px 20px rgba(15,23,42,0.10)"
  };
}

export function ChartCard({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <Card className="min-h-[330px]">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="font-semibold text-[#0F172A]">{title}</h3>
          {subtitle ? <p className="mt-1 text-xs text-[#64748B]">{subtitle}</p> : null}
        </div>
      </div>
      <div className="h-64">{children}</div>
    </Card>
  );
}

export function CategoryPie({ data }: { data: any[] }) {
  return (
    <ResponsiveContainer>
      <PieChart>
        <Tooltip contentStyle={tooltipStyle()} />
        <Pie data={data} dataKey="value" nameKey="name" innerRadius={54} outerRadius={92} paddingAngle={2}>
          {data.map((d, i) => <Cell key={d.name} fill={d.color || palette[i % palette.length]} />)}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}

export function CategoryBar({ data }: { data: any[] }) {
  return (
    <ResponsiveContainer>
      <BarChart data={data} margin={{ left: -18, right: 8 }}>
        <CartesianGrid vertical={false} stroke={grid} />
        <XAxis dataKey="name" stroke={axis} tick={{ fontSize: 11, fill: "#64748B" }} tickLine={false} axisLine={false} />
        <YAxis stroke={axis} tick={{ fill: "#64748B" }} tickLine={false} axisLine={false} />
        <Tooltip contentStyle={tooltipStyle()} />
        <Bar dataKey="value" fill="#2563EB" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function ScoreBar({ data }: { data: any[] }) {
  return (
    <ResponsiveContainer>
      <BarChart data={data} margin={{ left: -18, right: 8 }}>
        <CartesianGrid vertical={false} stroke={grid} />
        <XAxis dataKey="name" stroke={axis} tick={{ fontSize: 11, fill: "#64748B" }} tickLine={false} axisLine={false} />
        <YAxis stroke={axis} tick={{ fill: "#64748B" }} tickLine={false} axisLine={false} domain={[0, 100]} />
        <Tooltip contentStyle={tooltipStyle()} />
        <Bar dataKey="averageScore" fill="#0EA5E9" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function TimeLine({ data }: { data: any[] }) {
  return (
    <ResponsiveContainer>
      <LineChart data={data} margin={{ left: -18, right: 8 }}>
        <CartesianGrid vertical={false} stroke={grid} />
        <XAxis dataKey="date" stroke={axis} tick={{ fill: "#64748B" }} tickLine={false} axisLine={false} />
        <YAxis stroke={axis} tick={{ fill: "#64748B" }} tickLine={false} axisLine={false} />
        <Tooltip contentStyle={tooltipStyle()} />
        <Line type="monotone" dataKey="calls" stroke="#2563EB" strokeWidth={2.5} dot={false} activeDot={{ r: 5, fill: "#2563EB" }} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function TrendArea({ data }: { data: any[] }) {
  return (
    <ResponsiveContainer>
      <AreaChart data={data} margin={{ left: -18, right: 8 }}>
        <defs>
          <linearGradient id="trend" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#2563EB" stopOpacity={0.20} />
            <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke={grid} />
        <XAxis dataKey="date" stroke={axis} tick={{ fill: "#64748B" }} tickLine={false} axisLine={false} />
        <YAxis stroke={axis} tick={{ fill: "#64748B" }} tickLine={false} axisLine={false} />
        <Tooltip contentStyle={tooltipStyle()} />
        <Area type="monotone" dataKey="calls" stroke="#2563EB" strokeWidth={2} fill="url(#trend)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function SentimentPie({ data }: { data: any[] }) {
  const colors: Record<string, string> = { Positive: "#16A34A", Neutral: "#F59E0B", Negative: "#DC2626" };
  return (
    <ResponsiveContainer>
      <PieChart>
        <Tooltip contentStyle={tooltipStyle()} />
        <Pie data={data} dataKey="value" nameKey="name" innerRadius={54} outerRadius={92} paddingAngle={2}>
          {data.map((d) => <Cell key={d.name} fill={colors[d.name] || "#94A3B8"} />)}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}

export function RadialMetric({ label, value }: { label: string; value: number }) {
  return (
    <Card>
      <div className="h-36">
        <ResponsiveContainer>
          <RadialBarChart innerRadius="72%" outerRadius="100%" data={[{ value, fill: "#2563EB" }]} startAngle={90} endAngle={-270}>
            <RadialBar dataKey="value" background={{ fill: "#EEF3F9" }} cornerRadius={8} />
          </RadialBarChart>
        </ResponsiveContainer>
      </div>
      <p className="text-center text-sm text-[#64748B]">{label}</p>
      <p className="text-center text-2xl font-bold text-[#0F172A]">{value}%</p>
    </Card>
  );
}
