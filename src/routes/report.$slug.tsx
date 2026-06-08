import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, AreaChart, Area, BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, Radar,
} from "recharts";
import { getReport, getOrGenerateReport } from "@/lib/reports.functions";
import { AppShell } from "@/components/AppShell";
import type { StartupReport } from "@/lib/report-types";

export const Route = createFileRoute("/report/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.slug.replace(/-/g, " ")} — Helix DNA Dossier` },
      { name: "description", content: `AI intelligence dossier on ${params.slug.replace(/-/g, " ")}. Founder DNA, growth, competitors, predictions.` },
      { property: "og:title", content: `${params.slug.replace(/-/g, " ")} — Helix DNA` },
      { property: "og:description", content: "Investor-grade startup intelligence." },
    ],
  }),
  component: ReportPage,
});

function ReportPage() {
  const { slug } = Route.useParams();
  const navigate = useNavigate();
  const fetchReport = useServerFn(getReport);
  const generate = useServerFn(getOrGenerateReport);
  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState<string | null>(null);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["report", slug],
    queryFn: () => fetchReport({ data: { slug } }),
  });

  // Auto-generate if slug doesn't exist
  useEffect(() => {
    if (!isLoading && data === null && !generating) {
      setGenerating(true);
      const niceName = slug.split("-").map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
      generate({ data: { name: niceName } })
        .then(() => refetch())
        .catch((e) => setGenError((e as Error).message))
        .finally(() => setGenerating(false));
    }
  }, [data, isLoading, slug, generate, refetch, generating]);

  if (isLoading || generating || (!data && !genError)) {
    return (
      <AppShell>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-silver-muted mb-3 animate-pulse-dot">
              Compiling Dossier
            </div>
            <div className="text-2xl font-medium text-silver">{slug.replace(/-/g, " ")}</div>
            <div className="mt-4 text-xs text-silver-muted font-mono">Streaming founder, product, growth, competitor signals…</div>
          </div>
        </div>
      </AppShell>
    );
  }

  if (genError || !data) {
    return (
      <AppShell>
        <div className="p-12 max-w-xl">
          <div className="font-mono text-[10px] uppercase tracking-widest text-danger mb-3">Generation Failed</div>
          <p className="text-silver mb-6">{genError ?? "Dossier not found."}</p>
          <Link to="/" className="font-mono text-xs uppercase tracking-widest text-silver hover:underline">← Return to terminal</Link>
        </div>
      </AppShell>
    );
  }

  return <Dossier report={data.payload} slug={data.slug} />;
}

function Dossier({ report, slug }: { report: StartupReport; slug: string }) {
  const navigate = useNavigate();
  const compare = (a: string, b: string) => a.localeCompare(b);
  const fmt = (n: number) => Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(n);

  const radarData = [
    { axis: "Growth", v: report.scores.growth },
    { axis: "Innovation", v: report.scores.innovation },
    { axis: "Founder", v: report.scores.founder },
    { axis: "Market", v: report.scores.market },
    { axis: "Competition", v: report.scores.competition },
    { axis: "Investor", v: report.scores.investor_interest },
  ];

  return (
    <AppShell>
      <header className="h-16 border-b border-border-subtle/30 flex items-center px-6 md:px-8 justify-between sticky top-0 bg-surface-900/80 backdrop-blur-xl z-10">
        <div className="flex items-center gap-3">
          <Link to="/" className="font-mono text-[10px] uppercase tracking-widest text-silver-muted hover:text-silver">← Terminal</Link>
          <span className="text-silver-muted">/</span>
          <span className="font-mono text-[10px] uppercase tracking-widest text-silver">{slug}</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => window.print()}
            className="px-4 py-1.5 text-[11px] font-mono uppercase tracking-widest border border-border-subtle hover:border-silver rounded text-silver-muted hover:text-silver transition"
          >
            Export PDF
          </button>
        </div>
      </header>

      <div className="p-6 md:p-10 space-y-8 max-w-[1400px]">
        {/* Header */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-3 font-mono text-[10px] uppercase tracking-[0.25em] text-silver-muted">
              <span>{report.industry}</span>
              <span>·</span>
              <span>{report.sector}</span>
              <span>·</span>
              <span>{report.headquarters}</span>
              <span>·</span>
              <span>Founded {report.founded_year}</span>
            </div>
            <h1 className="text-5xl font-bold tracking-tight text-silver">{report.name}</h1>
            <p className="text-silver-muted mt-3 max-w-2xl text-pretty">{report.tagline}</p>
            <p className="text-silver/90 mt-5 max-w-2xl text-pretty leading-relaxed">{report.summary}</p>

            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-px bg-border-subtle/40 border border-border-subtle/40 rounded-lg overflow-hidden">
              {[
                ["Valuation", report.valuation],
                ["Funding Raised", report.funding_raised],
                ["Revenue", report.revenue_estimate],
                ["Employees", report.employee_count],
              ].map(([k, v]) => (
                <div key={k} className="bg-surface-800 p-4">
                  <div className="text-[10px] font-mono uppercase tracking-widest text-silver-muted mb-1">{k}</div>
                  <div className="font-mono text-silver">{v}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="panel p-6 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <span className="text-[10px] uppercase tracking-widest text-silver-muted font-mono font-bold">Health Score</span>
              <span className="px-2 py-0.5 bg-signal/10 text-signal text-[10px] rounded border border-signal/20 font-mono uppercase">
                {report.status}
              </span>
            </div>
            <div className="text-7xl font-mono text-center py-4 text-silver">
              {report.scores.health}<span className="text-xl text-silver-muted">/100</span>
            </div>
            <div className="space-y-2">
              {[
                ["Growth", report.scores.growth],
                ["Founder", report.scores.founder],
                ["Market", report.scores.market],
                ["Innovation", report.scores.innovation],
              ].map(([k, v]) => (
                <div key={k as string}>
                  <div className="flex justify-between text-[10px] font-mono">
                    <span className="text-silver-muted uppercase">{k}</span>
                    <span className="text-silver">{v as number}</span>
                  </div>
                  <div className="w-full h-1 bg-surface-700 rounded-full overflow-hidden mt-1">
                    <div className="bg-silver h-full" style={{ width: `${v as number}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="panel p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xs font-mono uppercase tracking-[0.25em] text-silver-muted">Operational Evolution</h2>
            <span className="text-[10px] font-mono text-silver-muted">{report.timeline.length} events</span>
          </div>
          <div className="overflow-x-auto scrollbar-hide pb-2">
            <div className="flex gap-6 min-w-max">
              {report.timeline.sort((a, b) => a.year - b.year).map((e, i) => (
                <div key={i} className="w-56 shrink-0 border-l border-silver/30 pl-4">
                  <div className="text-[10px] font-mono text-silver-muted uppercase">{e.year} · {e.kind}</div>
                  <div className="text-sm font-medium text-silver mt-1">{e.title}</div>
                  <p className="text-xs text-silver-muted mt-2 leading-relaxed">{e.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Growth Charts */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <GrowthChart title="Revenue Growth" data={report.growth.revenue} color="var(--color-silver)" kind="area" />
          <GrowthChart title="Valuation Growth" data={report.growth.valuation} color="var(--color-signal)" kind="line" />
          <GrowthChart title="User Growth" data={report.growth.users} color="var(--color-silver)" kind="bar" />
          <GrowthChart title="Headcount" data={report.growth.employees} color="var(--color-silver)" kind="area" />
        </section>

        {/* Founders + Radar */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            {report.founders.map((f, i) => (
              <div key={i} className="panel p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="size-10 bg-surface-700 rounded grid place-items-center text-xs font-bold text-silver">
                    {f.name.split(" ").map((p) => p[0]).join("").slice(0, 2)}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-silver">{f.name}</div>
                    <div className="text-[10px] text-silver-muted uppercase font-mono">{f.role}</div>
                  </div>
                </div>
                <p className="text-[11px] text-silver-muted leading-relaxed mb-2">{f.background}</p>
                <p className="text-[10px] text-silver-muted/80 leading-relaxed mb-3"><span className="uppercase font-mono">Edu:</span> {f.education}</p>
                <p className="text-[10px] text-silver-muted/80 leading-relaxed mb-4"><span className="uppercase font-mono">Prior:</span> {f.prior_companies}</p>
                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-border-subtle/30">
                  <div>
                    <div className="text-[9px] font-mono uppercase text-silver-muted">Strength</div>
                    <div className="text-sm font-mono text-silver">{f.strength_score}</div>
                  </div>
                  <div>
                    <div className="text-[9px] font-mono uppercase text-silver-muted">Risk</div>
                    <div className="text-sm font-mono text-silver">{f.risk_score}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="panel p-5">
            <h3 className="text-xs font-mono uppercase tracking-[0.25em] text-silver-muted mb-4">DNA Profile</h3>
            <ResponsiveContainer width="100%" height={260}>
              <RadarChart data={radarData} outerRadius={90}>
                <PolarGrid stroke="var(--color-border-subtle)" />
                <PolarAngleAxis dataKey="axis" tick={{ fill: "var(--color-silver-muted)", fontSize: 10 }} />
                <Radar dataKey="v" stroke="var(--color-silver)" fill="var(--color-silver)" fillOpacity={0.2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Product Evolution */}
        <section className="panel p-6">
          <h2 className="text-xs font-mono uppercase tracking-[0.25em] text-silver-muted mb-6">Product Evolution</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {report.product_evolution.map((p, i) => (
              <div key={i} className="border border-border-subtle/30 rounded-lg p-4 bg-surface-900/30">
                <div className="flex items-baseline justify-between mb-2">
                  <span className="font-mono text-xs text-silver">{p.version}</span>
                  <span className="font-mono text-[10px] text-silver-muted">{p.year}</span>
                </div>
                <h4 className="text-sm font-medium text-silver mb-3">{p.headline}</h4>
                <p className="text-[10px] text-signal/80 font-mono uppercase mb-1">+ Added</p>
                <p className="text-xs text-silver-muted mb-2">{p.added}</p>
                <p className="text-[10px] text-danger/70 font-mono uppercase mb-1">- Removed</p>
                <p className="text-xs text-silver-muted">{p.removed || "—"}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Competitors */}
        <section className="panel overflow-hidden">
          <div className="p-5 border-b border-border-subtle/30 flex justify-between items-center">
            <h2 className="text-xs font-mono uppercase tracking-[0.25em] text-silver-muted">Competitor Intelligence Matrix</h2>
            <span className="text-[10px] font-mono text-silver-muted">{report.competitors.length} rivals</span>
          </div>
          <table className="w-full text-left text-sm">
            <thead className="text-silver-muted border-b border-border-subtle/30">
              <tr>
                <th className="px-6 py-3 font-medium text-[10px] uppercase tracking-widest font-mono">Competitor</th>
                <th className="px-6 py-3 font-medium text-[10px] uppercase tracking-widest font-mono">Category</th>
                <th className="px-6 py-3 font-medium text-[10px] uppercase tracking-widest font-mono">Valuation</th>
                <th className="px-6 py-3 font-medium text-[10px] uppercase tracking-widest font-mono">Advantage</th>
                <th className="px-6 py-3 font-medium text-[10px] uppercase tracking-widest font-mono text-right">DNA Match</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle/20">
              {report.competitors.map((c, i) => (
                <tr key={i} className="hover:bg-surface-700/30 transition-colors">
                  <td className="px-6 py-4 font-semibold text-silver">{c.name}</td>
                  <td className="px-6 py-4 text-silver-muted">{c.category}</td>
                  <td className="px-6 py-4 font-mono text-silver">{c.valuation}</td>
                  <td className="px-6 py-4 text-silver-muted text-xs">{c.advantage}</td>
                  <td className="px-6 py-4 text-right font-mono text-silver">{c.similarity}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Funding */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 panel p-6">
            <h2 className="text-xs font-mono uppercase tracking-[0.25em] text-silver-muted mb-6">Funding Rounds</h2>
            <div className="space-y-3">
              {report.funding_rounds.sort((a, b) => a.year - b.year).map((r, i) => (
                <div key={i} className="grid grid-cols-12 gap-4 py-3 border-b border-border-subtle/20 last:border-0">
                  <div className="col-span-2 font-mono text-xs text-silver-muted">{r.year}</div>
                  <div className="col-span-2 text-sm font-medium text-silver">{r.round}</div>
                  <div className="col-span-2 font-mono text-sm text-silver">{r.amount}</div>
                  <div className="col-span-3 text-xs text-silver-muted">{r.lead_investors}</div>
                  <div className="col-span-3 text-right font-mono text-xs text-silver-muted">{r.valuation}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="panel p-6">
            <h2 className="text-xs font-mono uppercase tracking-[0.25em] text-silver-muted mb-6">Market</h2>
            <div className="space-y-4">
              {[["TAM", report.market.tam], ["SAM", report.market.sam], ["SOM", report.market.som], ["Growth", report.market.growth_rate]].map(([k, v]) => (
                <div key={k as string} className="flex justify-between border-b border-border-subtle/20 pb-2">
                  <span className="text-[10px] font-mono uppercase text-silver-muted">{k}</span>
                  <span className="font-mono text-sm text-silver">{v}</span>
                </div>
              ))}
              <div className="pt-2">
                <div className="text-[10px] font-mono uppercase text-silver-muted mb-2">Opportunities</div>
                <ul className="space-y-1.5">
                  {report.market.opportunities.map((o, i) => (
                    <li key={i} className="text-xs text-silver-muted flex gap-2"><span className="text-silver">→</span>{o}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Success / Failure / Predictions */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <FactorList title="Success Factors" items={report.success_factors} accent="signal" />
          <FactorList title="Failure Risks" items={report.failure_risks} accent="danger" />
          <div className="panel p-6">
            <h2 className="text-xs font-mono uppercase tracking-[0.25em] text-silver-muted mb-4">AI Predictions · 3yr</h2>
            <div className="space-y-3">
              {[["Future Revenue", report.predictions.future_revenue], ["Future Users", report.predictions.future_users], ["Future Valuation", report.predictions.future_valuation]].map(([k, v]) => (
                <div key={k as string}>
                  <div className="text-[10px] font-mono uppercase text-silver-muted">{k}</div>
                  <div className="font-mono text-silver">{v}</div>
                </div>
              ))}
              <div className="pt-3 border-t border-border-subtle/30 grid grid-cols-2 gap-2">
                <div>
                  <div className="text-[10px] font-mono uppercase text-silver-muted">Growth Prob</div>
                  <div className="font-mono text-signal text-lg">{report.predictions.growth_probability}%</div>
                </div>
                <div>
                  <div className="text-[10px] font-mono uppercase text-silver-muted">Failure Prob</div>
                  <div className="font-mono text-danger text-lg">{report.predictions.failure_probability}%</div>
                </div>
              </div>
              <p className="text-xs text-silver-muted pt-2 leading-relaxed">{report.predictions.three_year_outlook}</p>
            </div>
          </div>
        </section>

        {/* Lessons */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FactorList title="Lessons · Founders" items={report.lessons.founders} />
          <FactorList title="Lessons · PMs" items={report.lessons.product_managers} />
          <FactorList title="Lessons · Investors" items={report.lessons.investors} />
        </section>

        {/* Recommendations */}
        <section className="panel p-8 border-silver/20">
          <h2 className="text-xs font-mono uppercase tracking-[0.25em] text-silver-muted mb-4">Final Recommendations</h2>
          <ol className="space-y-3">
            {report.recommendations.map((r, i) => (
              <li key={i} className="flex gap-4">
                <span className="font-mono text-silver-muted text-xs pt-0.5">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-silver text-pretty">{r}</span>
              </li>
            ))}
          </ol>
        </section>

        <footer className="pt-8 pb-4 border-t border-border-subtle/30 flex justify-between items-center text-[10px] font-mono uppercase tracking-widest text-silver-muted">
          <span>Helix DNA · Intelligence Engine v1.0</span>
          <span>AI-generated · verify before investment decisions</span>
        </footer>
      </div>
    </AppShell>
  );
}

function GrowthChart({ title, data, color, kind }: { title: string; data: { year: number; value: number }[]; color: string; kind: "line" | "area" | "bar" }) {
  const sorted = [...data].sort((a, b) => a.year - b.year);
  return (
    <div className="panel p-5">
      <h3 className="text-xs font-mono uppercase tracking-[0.25em] text-silver-muted mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={200}>
        {kind === "line" ? (
          <LineChart data={sorted}>
            <XAxis dataKey="year" tick={{ fill: "var(--color-silver-muted)", fontSize: 10 }} axisLine={{ stroke: "var(--color-border-subtle)" }} tickLine={false} />
            <YAxis tick={{ fill: "var(--color-silver-muted)", fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ backgroundColor: "var(--color-surface-800)", border: "1px solid var(--color-border-subtle)", borderRadius: 6, fontSize: 12 }} />
            <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={{ fill: color, r: 3 }} />
          </LineChart>
        ) : kind === "bar" ? (
          <BarChart data={sorted}>
            <XAxis dataKey="year" tick={{ fill: "var(--color-silver-muted)", fontSize: 10 }} axisLine={{ stroke: "var(--color-border-subtle)" }} tickLine={false} />
            <YAxis tick={{ fill: "var(--color-silver-muted)", fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ backgroundColor: "var(--color-surface-800)", border: "1px solid var(--color-border-subtle)", borderRadius: 6, fontSize: 12 }} />
            <Bar dataKey="value" fill={color} fillOpacity={0.7} />
          </BarChart>
        ) : (
          <AreaChart data={sorted}>
            <defs>
              <linearGradient id={`g-${title}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.4} />
                <stop offset="100%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="year" tick={{ fill: "var(--color-silver-muted)", fontSize: 10 }} axisLine={{ stroke: "var(--color-border-subtle)" }} tickLine={false} />
            <YAxis tick={{ fill: "var(--color-silver-muted)", fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ backgroundColor: "var(--color-surface-800)", border: "1px solid var(--color-border-subtle)", borderRadius: 6, fontSize: 12 }} />
            <Area type="monotone" dataKey="value" stroke={color} strokeWidth={2} fill={`url(#g-${title})`} />
          </AreaChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}

function FactorList({ title, items, accent }: { title: string; items: string[]; accent?: "signal" | "danger" }) {
  const color = accent === "signal" ? "text-signal" : accent === "danger" ? "text-danger" : "text-silver";
  return (
    <div className="panel p-6">
      <h2 className="text-xs font-mono uppercase tracking-[0.25em] text-silver-muted mb-4">{title}</h2>
      <ul className="space-y-3">
        {items.map((it, i) => (
          <li key={i} className="flex gap-3 text-sm text-silver text-pretty leading-relaxed">
            <span className={`font-mono shrink-0 ${color}`}>▸</span>
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
