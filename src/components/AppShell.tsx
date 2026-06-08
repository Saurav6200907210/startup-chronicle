import { Link } from "@tanstack/react-router";
import { ThemeToggle } from "./ThemeToggle";
import logoAsset from "@/assets/startupdna-logo.png.asset.json";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-surface-900 text-silver flex">
      <aside className="w-64 border-r border-border-subtle/50 flex-col p-6 space-y-8 hidden md:flex shrink-0 sticky top-0 h-screen overflow-y-auto">

        <Link to="/" className="flex items-center space-x-2.5">
          <img src={logoAsset.url} alt="StartupDNA" className="size-8 rounded-md object-cover" />
          <span className="font-bold tracking-tight text-lg">
            <span className="text-silver">Startup</span>
            <span className="bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] bg-clip-text text-transparent">DNA</span>
          </span>
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
        <div className="flex items-center justify-between pt-4 border-t border-border-subtle/30">
          <span className="text-[10px] font-mono uppercase tracking-widest text-silver-muted">Theme</span>
          <ThemeToggle />
        </div>
        <div className="pt-6 border-t border-border-subtle/30">
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
