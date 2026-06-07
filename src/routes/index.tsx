import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { AppShell } from "@/components/AppShell";
import { getOrGenerateReport, listRecentReports } from "@/lib/reports.functions";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Helix DNA — Decode the architecture of any startup" },
      { name: "description", content: "AI-generated investor-grade intelligence dossiers on any startup. Founder DNA, growth replay, competitor matrix, predictions." },
      { property: "og:title", content: "Helix DNA — Startup Intelligence Terminal" },
      { property: "og:description", content: "Investor-grade AI dossiers on any startup. Generated in seconds." },
    ],
  }),
  component: IndexPage,
});

const SUGGESTIONS = ["Stripe", "OpenAI", "Airbnb", "Notion", "Uber", "Anthropic", "Vercel", "Figma"];

function IndexPage() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const generate = useServerFn(getOrGenerateReport);
  const listFn = useServerFn(listRecentReports);

  const recent = useQuery({ queryKey: ["reports"], queryFn: () => listFn() });

  const mutation = useMutation({
    mutationFn: (name: string) => generate({ data: { name } }),
    onSuccess: (res) => navigate({ to: "/report/$slug", params: { slug: res.slug } }),
  });

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const n = query.trim();
    if (!n || mutation.isPending) return;
    mutation.mutate(n);
  };

  return (
    <AppShell>
      <header className="h-16 border-b border-border-subtle/30 flex items-center px-6 md:px-8 justify-between sticky top-0 bg-surface-900/80 backdrop-blur-xl z-10">
        <div className="flex items-center gap-3">
          <span className="size-1.5 rounded-full bg-signal animate-pulse-dot" />
          <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-silver-muted">Terminal Online · v1.0</span>
        </div>
        <div className="hidden sm:flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-silver-muted">
          <span>{recent.data?.length ?? 0} dossiers archived</span>
        </div>
      </header>

      <section className="relative px-6 md:px-12 pt-20 pb-16 border-b border-border-subtle/30">
        <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
        <div className="relative max-w-3xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded border border-border-subtle/50 bg-surface-800/60 mb-8">
            <div className="size-1.5 rounded-full bg-signal" />
            <span className="text-[10px] font-mono tracking-[0.2em] text-silver-muted uppercase">Intelligence Engine</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-medium tracking-tight text-balance leading-[1.05] text-silver mb-6">
            Decode the architecture of any startup.
          </h1>
          <p className="text-silver-muted text-pretty max-w-xl mb-10">
            Enter a company name. Helix generates a full investor-grade dossier — founder DNA, product evolution, growth curves, competitor matrix, health score, and AI predictions.
          </p>

          <form onSubmit={submit} className="max-w-2xl">
            <div className="relative flex items-center bg-surface-800 ring-1 ring-border-subtle rounded-lg overflow-hidden focus-within:ring-silver/70 transition">
              <span className="pl-4 pr-2 py-4 text-silver-muted font-mono text-sm shrink-0">$</span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Analyze any startup (e.g. Stripe, OpenAI, Notion)"
                className="w-full bg-transparent py-4 text-silver focus:outline-none font-mono text-sm placeholder:text-silver-muted/60"
                autoFocus
              />
              <button
                type="submit"
                disabled={mutation.isPending || !query.trim()}
                className="m-1.5 px-5 py-2.5 rounded-md bg-silver text-surface-900 font-mono text-[11px] uppercase tracking-widest disabled:opacity-40 hover:bg-silver/90 transition shrink-0"
              >
                {mutation.isPending ? "Analyzing…" : "Execute"}
              </button>
            </div>
            {mutation.isError && (
              <p className="mt-3 text-xs font-mono text-danger">
                {(mutation.error as Error)?.message ?? "Generation failed"}
              </p>
            )}
          </form>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-silver-muted mr-1">Quick scan:</span>
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                disabled={mutation.isPending}
                onClick={() => {
                  setQuery(s);
                  mutation.mutate(s);
                }}
                className="px-3 py-1 rounded-full border border-border-subtle/60 hover:border-silver text-xs text-silver-muted hover:text-silver transition"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 md:px-12 py-12">
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="text-xs font-mono uppercase tracking-[0.25em] text-silver-muted">Recent Archive</h2>
          <span className="text-[10px] font-mono text-silver-muted">Cached dossiers</span>
        </div>
        {recent.isLoading ? (
          <div className="text-silver-muted text-sm font-mono">Loading…</div>
        ) : (recent.data?.length ?? 0) === 0 ? (
          <div className="text-silver-muted text-sm font-mono">No dossiers yet. Run your first analysis above.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {recent.data!.map((r) => (
              <a
                key={r.slug}
                href={`/report/${r.slug}`}
                className="panel p-5 hover:border-silver/40 transition group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-silver-muted">Dossier</span>
                  <span className="text-[10px] font-mono text-silver-muted">{r.view_count ?? 0} views</span>
                </div>
                <h3 className="text-lg font-medium text-silver group-hover:tracking-wide transition">{r.name}</h3>
                <div className="mt-4 text-[10px] font-mono text-silver-muted">
                  {new Date(r.created_at).toLocaleDateString()}
                </div>
              </a>
            ))}
          </div>
        )}
      </section>
    </AppShell>
  );
}
