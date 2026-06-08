import { Link } from "@tanstack/react-router";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-surface-900 text-silver flex">
      <aside className="w-64 border-r border-border-subtle/50 flex-col p-6 space-y-8 hidden md:flex shrink-0 sticky top-0 h-screen overflow-y-auto">

        <Link to="/" className="flex items-center space-x-2.5">
          <div className="size-6 bg-silver rounded-sm" />
          <span className="font-bold tracking-tighter text-lg uppercase">Helix DNA</span>
        </Link>
        <nav className="flex-1 space-y-1">
          <div className="text-[10px] uppercase tracking-widest text-silver-muted mb-4 font-mono">Intelligence</div>
          <Link
            to="/"
            className="flex items-center px-3 py-2 text-sm text-silver-muted hover:text-silver transition-colors"
            activeOptions={{ exact: true }}
            activeProps={{ className: "flex items-center px-3 py-2 text-sm bg-surface-800 rounded-md border border-border-subtle/30 text-silver" }}
          >
            Terminal
          </Link>
          <Link
            to="/reports"
            className="flex items-center px-3 py-2 text-sm text-silver-muted hover:text-silver transition-colors"
            activeProps={{ className: "flex items-center px-3 py-2 text-sm bg-surface-800 rounded-md border border-border-subtle/30 text-silver" }}
          >
            Archive
          </Link>
        </nav>
        <div className="pt-8 border-t border-border-subtle/30">
          <div className="p-4 bg-surface-800 rounded-lg border border-border-subtle/20">
            <p className="text-[11px] text-silver-muted leading-relaxed italic">
              "Analyzing market shifts in real-time. Streaming founder, product, and growth signals."
            </p>
          </div>
        </div>
      </aside>
      <main className="flex-1 min-w-0 overflow-x-hidden">{children}</main>
    </div>
  );
}
