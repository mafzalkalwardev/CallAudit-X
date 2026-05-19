import { CategoryBar, CategoryPie, ChartCard, RadialMetric, ScoreBar, SentimentPie, TimeLine, TrendArea } from "@/components/Charts";
import { PageHeader } from "@/components/ui";
import { getSession } from "@/lib/auth";
import { customerAnalytics } from "@/lib/analytics";
import { getOrCreateDemoCustomer } from "@/lib/demo-user";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  const session = await getSession();
  const demoUser = session ? null : await getOrCreateDemoCustomer();
  const data = await customerAnalytics(session?.id || demoUser!.id);
  return (
    <>
      <PageHeader title="Analytics" subtitle="Charts are built from your real call, report, and verification records." />
      <div className="grid gap-4 md:grid-cols-4"><RadialMetric label="Average agent score" value={data.averageAgentScore} /><RadialMetric label="Lead quality" value={data.averageLeadQuality} /><RadialMetric label="AI confidence" value={data.averageConfidence} /><RadialMetric label="AI accuracy" value={data.aiAccuracy} /></div>
      <div className="mt-6 grid gap-6 xl:grid-cols-2"><ChartCard title="Category distribution" subtitle="Share of completed AI reports"><CategoryPie data={data.categoryDistribution} /></ChartCard><ChartCard title="Calls by category" subtitle="Volume by AI classification"><CategoryBar data={data.categoryDistribution} /></ChartCard><ChartCard title="Calls uploaded over time" subtitle="Daily upload trend"><TimeLine data={data.callsOverTime} /></ChartCard><ChartCard title="Average score by category" subtitle="Agent performance by call type"><ScoreBar data={data.categoryDistribution} /></ChartCard><ChartCard title="Sentiment distribution" subtitle="Positive, neutral, and negative breakdown"><SentimentPie data={data.sentimentDistribution} /></ChartCard><ChartCard title="Verification results" subtitle="Correct vs incorrect reviewer outcomes"><SentimentPie data={data.verificationDistribution} /></ChartCard><ChartCard title="Call volume trend" subtitle="Area trend from database values"><TrendArea data={data.callsOverTime} /></ChartCard></div>
    </>
  );
}
