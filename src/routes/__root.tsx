import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  ScriptOnce,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-900 px-4">
      <div className="max-w-md text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-silver-muted">Signal Lost</p>
        <h1 className="mt-3 text-7xl font-medium text-silver">404</h1>
        <p className="mt-4 text-sm text-silver-muted">
          The dossier you requested isn't in the archive.
        </p>
        <div className="mt-8">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded border border-border-subtle bg-surface-800 px-5 py-2.5 text-xs font-medium uppercase tracking-widest text-silver transition-colors hover:border-silver"
          >
            Return to Terminal
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-900 px-4">
      <div className="max-w-md text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-danger">System Error</p>
        <h1 className="mt-3 text-xl font-medium text-silver">Intelligence stream interrupted</h1>
        <p className="mt-2 text-sm text-silver-muted">
          The terminal couldn't render this dossier. Retry the request.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center rounded bg-silver px-5 py-2.5 text-xs font-medium uppercase tracking-widest text-surface-900 transition-colors hover:bg-silver/90"
          >
            Retry
          </button>
          <a
            href="/"
            className="inline-flex items-center rounded border border-border-subtle px-5 py-2.5 text-xs font-medium uppercase tracking-widest text-silver hover:border-silver"
          >
            Terminal
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "StartupDNA — Startup Intelligence Terminal" },
      {
        name: "description",
        content:
          "Decode the architecture of any startup. AI-generated founder, product, growth, competitor, and risk intelligence — investor-grade dossiers in seconds.",
      },
      { name: "author", content: "StartupDNA" },
      { property: "og:title", content: "StartupDNA — Startup Intelligence Terminal" },
      {
        property: "og:description",
        content:
          "Investor-grade AI dossiers on any startup: founder DNA, growth replay, competitor matrix, health score, predictions.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "StartupDNA — Startup Intelligence Terminal" },
      { name: "description", content: "Startup Chronicle provides AI-powered startup intelligence, offering deep analysis of founders, products, growth, and market dynamics." },
      { property: "og:description", content: "Startup Chronicle provides AI-powered startup intelligence, offering deep analysis of founders, products, growth, and market dynamics." },
      { name: "twitter:description", content: "Startup Chronicle provides AI-powered startup intelligence, offering deep analysis of founders, products, growth, and market dynamics." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/082052ff-e595-43bd-ac1f-34590adc34fe/id-preview-d52d33d4--d2acf4db-889d-4361-901d-3b35bcd5f676.lovable.app-1782500841231.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/082052ff-e595-43bd-ac1f-34590adc34fe/id-preview-d52d33d4--d2acf4db-889d-4361-901d-3b35bcd5f676.lovable.app-1782500841231.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <HeadContent />
        <ScriptOnce>{`(function(){try{var t=localStorage.getItem('theme');if(t==='light'){document.documentElement.classList.remove('dark');document.documentElement.classList.add('light');}}catch(e){}})();`}</ScriptOnce>
      </head>
      <body className="bg-surface-900 text-silver antialiased" suppressHydrationWarning>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}
