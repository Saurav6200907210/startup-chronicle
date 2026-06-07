import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { listRecentReports } from "@/lib/reports.functions";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [
      { title: "Archive — Helix DNA" },
      { name: "description", content: "Browse cached startup intelligence dossiers." },
    ],
  }),
  component: ReportsPage,
});

function ReportsPage() {
  const listFn = useServerFn(listRecentReports);
  const q = useQuery({ queryKey: ["reports"], queryFn: () => listFn() });

  return (
    <AppShell>
      <header className="h-16 border-b border-border-subtle/30 flex items-center px-6 md:px-8">
        <Link to="/" className="font-mono text-[10px] uppercase tracking-widest text-silver-muted hover:text-silver">← Terminal</Link>
        <span className="mx-3 text-silver-muted">/</span>
        <span className="font-mono text-[10px] uppercase tracking-widest text-silver">Archive</span>
      </header>
      <div className="p-6 md:p-10">
        <h1 className="text-3xl font-medium text-silver mb-2">Intelligence Archive</h1>
        <p className="text-silver-muted text-sm mb-8">{q.data?.length ?? 0} dossiers cached</p>
        {q.isLoading ? (
          <div className="text-silver-muted font-mono text-sm">Loading…</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {q.data?.map((r) => (
              <Link
                key={r.slug}
                to="/report/$slug"
                params={{ slug: r.slug }}
                className="panel p-5 hover:border-silver/40 transition group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-silver-muted">Dossier</span>
                  <span className="text-[10px] font-mono text-silver-muted">{r.view_count ?? 0} views</span>
                </div>
                <h3 className="text-lg font-medium text-silver">{r.name}</h3>
                <div className="mt-4 text-[10px] font-mono text-silver-muted">{new Date(r.created_at).toLocaleDateString()}</div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
