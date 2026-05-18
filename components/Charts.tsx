"use client";

import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, RadialBar, RadialBarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card } from "@/components/ui";

const grid = "#1f2937";
const axis = "#64748b";
const palette = ["#38bdf8", "#818cf8", "#34d399", "#fbbf24", "#fb7185", "#94a3b8", "#22c55e", "#a78bfa", "#2dd4bf", "#f97316"];

function tooltipStyle() {
  return {
    background: "rgba(8, 13, 23, 0.96)",
    border: "1px solid rgba(148, 163, 184, 0.18)",
    borderRadius: 10,
    color: "#e2e8f0",
    boxShadow: "0 16px 40px rgba(0,0,0,0.3)"
  };
}

export function ChartCard({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <Card className="min-h-[330px]">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="font-semibold text-slate-100">{title}</h3>
          {subtitle ? <p className="mt-1 text-xs text-slate-500">{subtitle}</p> : null}
        </div>
      </div>
      <div className="h-64">{children}</div>
    </Card>
  );
}

export function CategoryPie({ data }: { data: any[] }) {
  return <ResponsiveContainer><PieChart><Tooltip contentStyle={tooltipStyle()} /><Pie data={data} dataKey="value" nameKey="name" innerRadius={54} outerRadius={92} paddingAngle={2}>{data.map((d, i) => <Cell key={d.name} fill={d.color || palette[i % palette.length]} />)}</Pie></PieChart></ResponsiveContainer>;
}

export function CategoryBar({ data }: { data: any[] }) {
  return <ResponsiveContainer><BarChart data={data} margin={{ left: -18, right: 8 }}><CartesianGrid vertical={false} stroke={grid} /><XAxis dataKey="name" stroke={axis} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} /><YAxis stroke={axis} tickLine={false} axisLine={false} /><Tooltip contentStyle={tooltipStyle()} /><Bar dataKey="value" fill="#38bdf8" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer>;
}

export function ScoreBar({ data }: { data: any[] }) {
  return <ResponsiveContainer><BarChart data={data} margin={{ left: -18, right: 8 }}><CartesianGrid vertical={false} stroke={grid} /><XAxis dataKey="name" stroke={axis} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} /><YAxis stroke={axis} tickLine={false} axisLine={false} domain={[0, 100]} /><Tooltip contentStyle={tooltipStyle()} /><Bar dataKey="averageScore" fill="#818cf8" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer>;
}

export function TimeLine({ data }: { data: any[] }) {
  return <ResponsiveContainer><LineChart data={data} margin={{ left: -18, right: 8 }}><CartesianGrid vertical={false} stroke={grid} /><XAxis dataKey="date" stroke={axis} tickLine={false} axisLine={false} /><YAxis stroke={axis} tickLine={false} axisLine={false} /><Tooltip contentStyle={tooltipStyle()} /><Line type="monotone" dataKey="calls" stroke="#38bdf8" strokeWidth={3} dot={false} activeDot={{ r: 5, fill: "#38bdf8" }} /></LineChart></ResponsiveContainer>;
}

export function TrendArea({ data }: { data: any[] }) {
  return <ResponsiveContainer><AreaChart data={data} margin={{ left: -18, right: 8 }}><defs><linearGradient id="trend" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#38bdf8" stopOpacity={0.45}/><stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/></linearGradient></defs><CartesianGrid vertical={false} stroke={grid} /><XAxis dataKey="date" stroke={axis} tickLine={false} axisLine={false} /><YAxis stroke={axis} tickLine={false} axisLine={false} /><Tooltip contentStyle={tooltipStyle()} /><Area type="monotone" dataKey="calls" stroke="#38bdf8" strokeWidth={2} fill="url(#trend)" /></AreaChart></ResponsiveContainer>;
}

export function SentimentPie({ data }: { data: any[] }) {
  const colors: Record<string, string> = { Positive: "#34d399", Neutral: "#fbbf24", Negative: "#fb7185" };
  return <ResponsiveContainer><PieChart><Tooltip contentStyle={tooltipStyle()} /><Pie data={data} dataKey="value" nameKey="name" innerRadius={54} outerRadius={92} paddingAngle={2}>{data.map((d) => <Cell key={d.name} fill={colors[d.name] || "#94a3b8"} />)}</Pie></PieChart></ResponsiveContainer>;
}

export function RadialMetric({ label, value }: { label: string; value: number }) {
  return (
    <Card>
      <div className="h-36">
        <ResponsiveContainer>
          <RadialBarChart innerRadius="72%" outerRadius="100%" data={[{ value, fill: "#38bdf8" }]} startAngle={90} endAngle={-270}>
            <RadialBar dataKey="value" background={{ fill: "#111827" }} cornerRadius={8} />
          </RadialBarChart>
        </ResponsiveContainer>
      </div>
      <p className="text-center text-sm text-slate-400">{label}</p>
      <p className="text-center text-2xl font-semibold">{value}%</p>
    </Card>
  );
}
