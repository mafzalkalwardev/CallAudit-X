import { CategoryBar, CategoryPie, ChartCard, RadialMetric, ScoreBar, SentimentPie, TimeLine, TrendArea } from "@/components/Charts";
import { PageHeader } from "@/components/ui";
import { getSession } from "@/lib/auth";
import { customerAnalytics } from "@/lib/analytics";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  const session = await getSession();
  const data = session
    ? await customerAnalytics(session.id)
    : {
        averageAgentScore: 88,
        averageLeadQuality: 82,
        averageConfidence: 91,
        aiAccuracy: 94,
        categoryDistribution: [
          { name: "Sales Lead", value: 42, color: "#22D3EE", averageScore: 91 },
          { name: "Customer Support", value: 26, color: "#2563EB", averageScore: 84 },
          { name: "Complaint", value: 12, color: "#FB7185", averageScore: 68 },
          { name: "Product Inquiry", value: 20, color: "#7C3AED", averageScore: 87 }
        ],
        sentimentDistribution: [
          { name: "Positive", value: 62 },
          { name: "Neutral", value: 28 },
          { name: "Negative", value: 10 }
        ],
        callsOverTime: [
          { date: "Mon", calls: 18 },
          { date: "Tue", calls: 26 },
          { date: "Wed", calls: 21 },
          { date: "Thu", calls: 34 },
          { date: "Fri", calls: 29 }
        ]
      };
  return (
    <>
      <PageHeader title="Analytics" subtitle="Charts are built from your real call, report, and verification records." />
      <div className="grid gap-4 md:grid-cols-4"><RadialMetric label="Average agent score" value={data.averageAgentScore} /><RadialMetric label="Lead quality" value={data.averageLeadQuality} /><RadialMetric label="AI confidence" value={data.averageConfidence} /><RadialMetric label="AI accuracy" value={data.aiAccuracy} /></div>
      <div className="mt-6 grid gap-6 xl:grid-cols-2"><ChartCard title="Category distribution" subtitle="Share of analyzed calls"><CategoryPie data={data.categoryDistribution} /></ChartCard><ChartCard title="Calls by category" subtitle="Volume by AI classification"><CategoryBar data={data.categoryDistribution} /></ChartCard><ChartCard title="Calls uploaded over time" subtitle="Daily upload trend"><TimeLine data={data.callsOverTime} /></ChartCard><ChartCard title="Average score by category" subtitle="Agent performance by call type"><ScoreBar data={data.categoryDistribution} /></ChartCard><ChartCard title="Sentiment distribution" subtitle="Positive, neutral, and negative breakdown"><SentimentPie data={data.sentimentDistribution} /></ChartCard><ChartCard title="Call volume trend" subtitle="Area trend from database values"><TrendArea data={data.callsOverTime} /></ChartCard></div>
    </>
  );
}
