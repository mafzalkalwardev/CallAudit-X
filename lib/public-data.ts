export const trustBadges = ["Audio to Transcript", "AI Audit Report", "Human Verification", "Score Breakdown", "QA Analytics"];

export const auditStages = [
  { label: "01", title: "Upload recorded calls", description: "Drop mp3, wav, or m4a files into the intake queue with agent, campaign, and call-type metadata." },
  { label: "02", title: "Generate transcript", description: "AI converts the audio into a readable conversation transcript with speaker turns and review-ready timestamps." },
  { label: "03", title: "Audit the conversation", description: "The system detects category, sentiment, intent, mistakes, customer mood, outcome, and recommended action." },
  { label: "04", title: "Score and verify", description: "Managers review agent score, lead quality, call quality, AI confidence, and approve or correct the result." }
];

export const features = [
  { icon: "UploadCloud", title: "Audio Intake Queue", description: "A focused upload workflow for recorded calls, metadata, and processing status." },
  { icon: "FileAudio", title: "Replayable Call Evidence", description: "Keep the original audio attached to every transcript and audit report." },
  { icon: "MessageSquareText", title: "AI Transcript Workspace", description: "Read the conversation with timestamped speaker turns built for QA review." },
  { icon: "Bot", title: "Structured AI Audit", description: "Convert every call into summary, category, sentiment, intent, mistakes, and next action." },
  { icon: "Gauge", title: "Score Breakdown", description: "Track agent performance, lead quality, call quality, and confidence scores." },
  { icon: "Tags", title: "Audit Categorization", description: "Classify calls as sales lead, support, complaint, booking, voicemail, conversion, and more." },
  { icon: "SearchCheck", title: "Reviewer Verification", description: "Let users mark AI reviews correct or submit category corrections and feedback." },
  { icon: "Brain", title: "Sentiment and Intent", description: "Surface customer mood, buying intent, escalation risk, and follow-up opportunities." },
  { icon: "BarChart3", title: "QA Analytics Loop", description: "Turn verified reports into category distribution, score trends, and AI accuracy analytics." }
];

export const services = [
  { icon: "FileAudio", title: "Audio Upload and Replay", description: "Store call recordings in a reviewable workspace with evidence-first playback." },
  { icon: "MessageSquareText", title: "Call Transcription", description: "Transform recordings into timestamped transcripts for managers and QA reviewers." },
  { icon: "Bot", title: "AI Conversation Audit", description: "Generate structured reports with summary, category, sentiment, mistakes, and recommended action." },
  { icon: "Gauge", title: "Agent Scorecards", description: "Score agent handling, call quality, lead quality, and AI confidence in one panel." },
  { icon: "Tags", title: "Category Classification", description: "Detect call type and route each conversation to the right operating workflow." },
  { icon: "Brain", title: "Intent and Mood Detection", description: "Capture what the caller wanted and how they felt during the interaction." },
  { icon: "SearchCheck", title: "Human Review Verification", description: "Close the loop by confirming or correcting AI results from the call detail page." },
  { icon: "ShieldCheck", title: "QA Report Archive", description: "Maintain a searchable record of transcripts, scores, corrections, and reviewer notes." },
  { icon: "BarChart3", title: "Audit Analytics", description: "Measure score trends, sentiment distribution, category mix, and verified AI accuracy." },
  { icon: "Building2", title: "Admin Oversight", description: "Monitor customers, calls, corrected AI mistakes, and platform audit performance." }
];

export const workflow = [
  { title: "Create the audit workspace", description: "Start with a clean workspace for sales, support, or QA teams." },
  { title: "Choose the review volume", description: "Select a plan based on how many calls the team audits each month." },
  { title: "Upload calls with metadata", description: "Attach recordings, agent names, campaign names, call type, and reviewer notes." },
  { title: "AI transcribes the audio", description: "Generate a readable transcript that stays connected to the original recording." },
  { title: "AI builds the audit report", description: "Summarize the call, detect category and sentiment, list keywords, mistakes, and next action." },
  { title: "AI scores call quality", description: "Calculate agent score, lead quality, call quality, and confidence score." },
  { title: "Reviewer verifies the report", description: "Mark the AI review correct or submit the corrected category and feedback." },
  { title: "Analytics update from reviews", description: "Dashboards reflect real audit outcomes, category mix, scores, and AI accuracy." },
  { title: "Admins monitor quality", description: "Admin teams track corrections, customers, reports, and platform-level audit performance." }
];

export const reviews = [
  { name: "Maya Chen", role: "Sales Manager", company: "Northstar CRM", quote: "The transcript plus audit report gives us a real coaching artifact for every sales call." },
  { name: "Owen Ross", role: "Call Center Owner", company: "BrightLine Voice", quote: "We no longer review calls blindly. The score breakdown tells managers where to listen first." },
  { name: "Priya Shah", role: "Support Lead", company: "HelioDesk", quote: "Verification is the key. Our reviewers can correct AI categories and keep accuracy visible." },
  { name: "Daniel Ford", role: "QA Manager", company: "ScalePoint", quote: "The workflow finally connects audio evidence, transcript, audit findings, and QA scores." },
  { name: "Alina Brooks", role: "Startup Founder", company: "LeadLayer", quote: "Lead quality detection helps us prioritize callbacks from inbound sales conversations." },
  { name: "Marcus Lee", role: "Revenue Ops", company: "OrbitWorks", quote: "The audit pipeline makes call outcomes easy to report without another spreadsheet." },
  { name: "Sofia Martin", role: "Customer Success", company: "CarePilot", quote: "The timestamped transcript and recommended action make escalations much easier to handle." },
  { name: "Ibrahim Khan", role: "Operations Director", company: "MetroAssist", quote: "Bulk upload into AI auditing changed our weekly quality-review rhythm." },
  { name: "Emma Walsh", role: "Support QA", company: "CloudRelay", quote: "This feels purpose-built for call QA, not a generic dashboard with call labels." }
];

export const plans = [
  { id: "starter", name: "Starter", price: "$29", description: "For teams starting with transcript-backed call audits.", features: ["50 calls/month", "AI transcript", "Basic audit report", "Audio playback", "Category detection", "Email support"] },
  { id: "pro", name: "Pro", price: "$99", description: "For teams verifying AI reports and tracking quality trends.", features: ["500 calls/month", "Advanced audit analytics", "AI confidence score", "Verification workflow", "Priority processing", "Export reports"] },
  { id: "business", name: "Business", price: "$249", description: "For high-volume QA operations with admin governance.", features: ["10,000 calls/month", "Team access", "Admin console", "Advanced reports", "Custom categories", "Priority support"] }
];

export const painPoints = [
  { icon: "Headphones", title: "Audio evidence is hard to review", description: "Managers need to jump between raw recordings, notes, and spreadsheets just to evaluate one call." },
  { icon: "Layers3", title: "Transcripts and QA scores are disconnected", description: "A transcript alone is not enough; teams need findings, categories, mistakes, and scores together." },
  { icon: "Sparkles", title: "AI needs human verification", description: "Without a correction workflow, teams cannot measure whether AI classifications are actually right." },
  { icon: "Cloud", title: "Insights arrive too late", description: "Leaders need the audit loop to update analytics as soon as calls are reviewed." }
];

export const mockCompanies = ["Northstar", "HelioDesk", "ScalePoint", "LeadLayer", "OrbitWorks", "CloudRelay"];
