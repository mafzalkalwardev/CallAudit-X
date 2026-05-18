export const defaultCategories = [
  { name: "Sales Lead", description: "Potential buyer evaluating a product or service.", color: "#22d3ee", icon: "BadgeDollarSign" },
  { name: "Customer Support", description: "Existing customer needs help or guidance.", color: "#60a5fa", icon: "Headphones" },
  { name: "Complaint", description: "Customer reports dissatisfaction or an issue.", color: "#f87171", icon: "TriangleAlert" },
  { name: "Appointment Booking", description: "Caller schedules or changes an appointment.", color: "#34d399", icon: "CalendarCheck" },
  { name: "Spam Call", description: "Irrelevant, automated, or suspicious call.", color: "#a78bfa", icon: "ShieldX" },
  { name: "Wrong Number", description: "Caller reached the wrong business or person.", color: "#94a3b8", icon: "PhoneOff" },
  { name: "Voicemail", description: "Recorded message without live conversation.", color: "#fbbf24", icon: "Voicemail" },
  { name: "Follow-Up Required", description: "Conversation needs a next touch from the team.", color: "#38bdf8", icon: "RefreshCcw" },
  { name: "Product Inquiry", description: "Caller asks product, feature, or pricing questions.", color: "#c084fc", icon: "PackageSearch" },
  { name: "Successful Conversion", description: "Call resulted in a booking, sale, or qualified win.", color: "#4ade80", icon: "CircleCheckBig" }
];

export const plans = [
  { name: "Starter", price: 2900, monthlyCallLimit: 50, features: ["50 calls/month", "Basic AI report", "Audio playback", "Verification workflow"], stripePriceId: "price_starter_test" },
  { name: "Pro", price: 9900, monthlyCallLimit: 500, features: ["500 calls/month", "Advanced analytics", "Corrections tracking", "Priority processing"], stripePriceId: "price_pro_test" },
  { name: "Business", price: 24900, monthlyCallLimit: 10000, features: ["High call limits", "Team access ready", "Admin analytics", "Export-ready reports"], stripePriceId: "price_business_test" }
];
