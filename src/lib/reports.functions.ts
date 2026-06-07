import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { StartupReport } from "./report-types";


const InputSchema = z.object({
  name: z.string().trim().min(1).max(100),
});

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

const SYSTEM_PROMPT = `You are HELIX-DNA, an AI startup intelligence analyst trained on the patterns of Bloomberg, PitchBook, CB Insights, and Crunchbase. Generate investor-grade dossiers on companies/startups. Be specific, use real numbers when commonly known; when uncertain, give grounded reasonable estimates and mark fields as "estimate". Never refuse — always produce a complete report. Tone: terse, analytical, no hype, no emojis.`;

// Tool schema kept tight to stay within Gemini constrained-decoding limits.
const REPORT_TOOL = {
  type: "function" as const,
  function: {
    name: "emit_startup_dossier",
    description: "Emit a complete startup intelligence dossier.",
    parameters: {
      type: "object",
      properties: {
        name: { type: "string" },
        tagline: { type: "string" },
        summary: { type: "string" },
        industry: { type: "string" },
        sector: { type: "string" },
        headquarters: { type: "string" },
        founded_year: { type: "number" },
        status: { type: "string", enum: ["operating", "acquired", "ipo", "shutdown"] },
        valuation: { type: "string" },
        funding_raised: { type: "string" },
        revenue_estimate: { type: "string" },
        employee_count: { type: "string" },
        scores: {
          type: "object",
          properties: {
            health: { type: "number" },
            growth: { type: "number" },
            innovation: { type: "number" },
            founder: { type: "number" },
            market: { type: "number" },
            competition: { type: "number" },
            investor_interest: { type: "number" },
            risk: { type: "number" },
          },
          required: ["health", "growth", "innovation", "founder", "market", "competition", "investor_interest", "risk"],
        },
        timeline: {
          type: "array",
          items: {
            type: "object",
            properties: {
              year: { type: "number" },
              title: { type: "string" },
              kind: { type: "string", enum: ["launch", "funding", "product", "rebrand", "acquisition", "ipo", "partnership", "milestone"] },
              detail: { type: "string" },
            },
            required: ["year", "title", "kind", "detail"],
          },
        },
        founders: {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: { type: "string" },
              role: { type: "string" },
              background: { type: "string" },
              education: { type: "string" },
              prior_companies: { type: "string" },
              strength_score: { type: "number" },
              risk_score: { type: "number" },
            },
            required: ["name", "role", "background", "education", "prior_companies", "strength_score", "risk_score"],
          },
        },
        product_evolution: {
          type: "array",
          items: {
            type: "object",
            properties: {
              version: { type: "string" },
              year: { type: "number" },
              headline: { type: "string" },
              added: { type: "string" },
              removed: { type: "string" },
            },
            required: ["version", "year", "headline", "added", "removed"],
          },
        },
        growth: {
          type: "object",
          properties: {
            revenue: {
              type: "array",
              items: {
                type: "object",
                properties: { year: { type: "number" }, value: { type: "number" } },
                required: ["year", "value"],
              },
            },
            users: {
              type: "array",
              items: {
                type: "object",
                properties: { year: { type: "number" }, value: { type: "number" } },
                required: ["year", "value"],
              },
            },
            valuation: {
              type: "array",
              items: {
                type: "object",
                properties: { year: { type: "number" }, value: { type: "number" } },
                required: ["year", "value"],
              },
            },
            employees: {
              type: "array",
              items: {
                type: "object",
                properties: { year: { type: "number" }, value: { type: "number" } },
                required: ["year", "value"],
              },
            },
          },
          required: ["revenue", "users", "valuation", "employees"],
        },
        competitors: {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: { type: "string" },
              category: { type: "string" },
              valuation: { type: "string" },
              similarity: { type: "number" },
              advantage: { type: "string" },
            },
            required: ["name", "category", "valuation", "similarity", "advantage"],
          },
        },
        funding_rounds: {
          type: "array",
          items: {
            type: "object",
            properties: {
              round: { type: "string" },
              year: { type: "number" },
              amount: { type: "string" },
              lead_investors: { type: "string" },
              valuation: { type: "string" },
            },
            required: ["round", "year", "amount", "lead_investors", "valuation"],
          },
        },
        market: {
          type: "object",
          properties: {
            tam: { type: "string" },
            sam: { type: "string" },
            som: { type: "string" },
            growth_rate: { type: "string" },
            opportunities: { type: "array", items: { type: "string" } },
          },
          required: ["tam", "sam", "som", "growth_rate", "opportunities"],
        },
        success_factors: { type: "array", items: { type: "string" } },
        failure_risks: { type: "array", items: { type: "string" } },
        predictions: {
          type: "object",
          properties: {
            future_revenue: { type: "string" },
            future_users: { type: "string" },
            future_valuation: { type: "string" },
            growth_probability: { type: "number" },
            failure_probability: { type: "number" },
            three_year_outlook: { type: "string" },
          },
          required: ["future_revenue", "future_users", "future_valuation", "growth_probability", "failure_probability", "three_year_outlook"],
        },
        lessons: {
          type: "object",
          properties: {
            founders: { type: "array", items: { type: "string" } },
            product_managers: { type: "array", items: { type: "string" } },
            investors: { type: "array", items: { type: "string" } },
          },
          required: ["founders", "product_managers", "investors"],
        },
        recommendations: { type: "array", items: { type: "string" } },
      },
      required: [
        "name", "tagline", "summary", "industry", "sector", "headquarters", "founded_year",
        "status", "valuation", "funding_raised", "revenue_estimate", "employee_count",
        "scores", "timeline", "founders", "product_evolution", "growth", "competitors",
        "funding_rounds", "market", "success_factors", "failure_risks", "predictions",
        "lessons", "recommendations",
      ],
    },
  },
};

type GenResult = { slug: string; name: string; payload: StartupReport; cached: boolean };

export const getOrGenerateReport = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => InputSchema.parse(data))
  .handler(async ({ data }): Promise<GenResult> => {
    const slug = slugify(data.name);
    if (!slug) throw new Error("Invalid startup name");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Cache hit?
    const { data: existing } = await supabaseAdmin
      .from("reports")
      .select("slug, name, payload, created_at, view_count")
      .eq("slug", slug)
      .maybeSingle();

    if (existing) {
      await supabaseAdmin
        .from("reports")
        .update({ view_count: (existing.view_count ?? 0) + 1 })
        .eq("slug", slug);
      return {
        slug: existing.slug,
        name: existing.name,
        payload: existing.payload as unknown as StartupReport,
        cached: true,
      };
    }

    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("LOVABLE_API_KEY missing");

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          {
            role: "user",
            content: `Generate a full investor-grade startup intelligence dossier for: "${data.name}". Include 6-10 timeline events spanning founding to today, 1-3 founders, 3-5 product versions, 5-7 yearly data points for each growth series, 3-6 competitors, all funding rounds, and concrete success/failure factors and predictions.`,
          },
        ],
        tools: [REPORT_TOOL],
        tool_choice: { type: "function", function: { name: "emit_startup_dossier" } },
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      if (res.status === 429) throw new Error("Rate limit reached. Try again in a moment.");
      if (res.status === 402) throw new Error("AI credits exhausted. Add credits in workspace settings.");
      throw new Error(`AI gateway error ${res.status}: ${body.slice(0, 200)}`);
    }

    const json = await res.json();
    const call = json?.choices?.[0]?.message?.tool_calls?.[0];
    if (!call?.function?.arguments) {
      throw new Error("AI did not return a structured dossier");
    }
    let payload: StartupReport;
    try {
      payload = JSON.parse(call.function.arguments) as StartupReport;
    } catch {
      throw new Error("AI returned malformed JSON");
    }

    const displayName =
      typeof payload.name === "string" && payload.name.trim().length > 0
        ? payload.name
        : data.name;

    const { error: insertError } = await supabaseAdmin
      .from("reports")
      .insert({ slug, name: displayName, payload: payload as never });

    if (insertError) {
      const { data: retry } = await supabaseAdmin
        .from("reports")
        .select("slug, name, payload")
        .eq("slug", slug)
        .maybeSingle();
      if (retry) {
        return {
          slug: retry.slug,
          name: retry.name,
          payload: retry.payload as unknown as StartupReport,
          cached: true,
        };
      }
      throw insertError;
    }

    return { slug, name: displayName, payload, cached: false };
  });


export const listRecentReports = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("reports")
    .select("slug, name, created_at, view_count")
    .order("created_at", { ascending: false })
    .limit(24);
  if (error) throw error;
  return data ?? [];
});

export const getReport = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => z.object({ slug: z.string().min(1).max(120) }).parse(data))
  .handler(async ({ data }): Promise<{ slug: string; name: string; payload: StartupReport; created_at: string } | null> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin
      .from("reports")
      .select("slug, name, payload, created_at")
      .eq("slug", data.slug)
      .maybeSingle();
    if (error) throw error;
    if (!row) return null;
    return {
      slug: row.slug,
      name: row.name,
      created_at: row.created_at,
      payload: row.payload as unknown as StartupReport,
    };
  });

