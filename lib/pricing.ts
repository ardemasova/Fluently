export const PLUS_FEATURES = [
  "More practice sessions",
  "Personalized vocabulary",
  "Detailed conversation reviews",
  "Progress tracking",
];

export interface Plan {
  id: "free" | "plus" | "schools";
  name: string;
  price: string;
  period?: string;
  blurb: string;
  features: string[];
  cta: string;
  featured?: boolean;
}

export const PLANS: Plan[] = [
  {
    id: "free",
    name: "Free",
    price: "€0",
    period: "/month",
    blurb: "Try speaking practice at your own pace.",
    features: ["Limited AI conversation sessions", "Basic feedback", "One learning level"],
    cta: "Start for free",
  },
  {
    id: "plus",
    name: "Plus",
    price: "€12",
    period: "/month",
    blurb: "For learners who want to practise every week.",
    features: PLUS_FEATURES,
    cta: "Upgrade to Plus",
    featured: true,
  },
  {
    id: "schools",
    name: "For Schools",
    price: "Custom",
    blurb: "For language schools and teaching teams.",
    features: ["Teacher dashboard", "Student progress monitoring", "Classroom management", "School-level analytics"],
    cta: "Talk to us",
  },
];
