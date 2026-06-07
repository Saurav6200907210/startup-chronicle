export type Scores = {
  health: number;
  growth: number;
  innovation: number;
  founder: number;
  market: number;
  competition: number;
  investor_interest: number;
  risk: number;
};

export type TimelineEvent = {
  year: number;
  title: string;
  kind: "launch" | "funding" | "product" | "rebrand" | "acquisition" | "ipo" | "partnership" | "milestone";
  detail: string;
};

export type Founder = {
  name: string;
  role: string;
  background: string;
  education: string;
  prior_companies: string;
  strength_score: number;
  risk_score: number;
};

export type ProductVersion = {
  version: string;
  year: number;
  headline: string;
  added: string;
  removed: string;
};

export type Series = { year: number; value: number };

export type Growth = {
  revenue: Series[];
  users: Series[];
  valuation: Series[];
  employees: Series[];
};

export type Competitor = {
  name: string;
  category: string;
  valuation: string;
  similarity: number;
  advantage: string;
};

export type FundingRound = {
  round: string;
  year: number;
  amount: string;
  lead_investors: string;
  valuation: string;
};

export type Market = {
  tam: string;
  sam: string;
  som: string;
  growth_rate: string;
  opportunities: string[];
};

export type Predictions = {
  future_revenue: string;
  future_users: string;
  future_valuation: string;
  growth_probability: number;
  failure_probability: number;
  three_year_outlook: string;
};

export type Lessons = {
  founders: string[];
  product_managers: string[];
  investors: string[];
};

export type StartupReport = {
  name: string;
  tagline: string;
  summary: string;
  industry: string;
  sector: string;
  headquarters: string;
  founded_year: number;
  status: "operating" | "acquired" | "ipo" | "shutdown";
  valuation: string;
  funding_raised: string;
  revenue_estimate: string;
  employee_count: string;
  scores: Scores;
  timeline: TimelineEvent[];
  founders: Founder[];
  product_evolution: ProductVersion[];
  growth: Growth;
  competitors: Competitor[];
  funding_rounds: FundingRound[];
  market: Market;
  success_factors: string[];
  failure_risks: string[];
  predictions: Predictions;
  lessons: Lessons;
  recommendations: string[];
};
