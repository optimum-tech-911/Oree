/* eslint-disable react-refresh/only-export-components */
import { StrictMode, useEffect } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { BrowserRouter, MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "@/App";
import { AuthProvider } from "@/features/auth/AuthProvider";
import { captureAttribution } from "@/services/attribution";
import { AppErrorBoundary } from "@/components/feedback/AppErrorBoundary";
import "@/styles.css";

captureAttribution();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 45_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const useMemoryRouter = !["http:", "https:"].includes(window.location.protocol);
const previewRoute = (window as Window & { __OREE_PREVIEW_ROUTE__?: string }).__OREE_PREVIEW_ROUTE__;
const Router = useMemoryRouter ? MemoryRouter : BrowserRouter;
const initialEntries = useMemoryRouter
  ? [previewRoute ?? new URLSearchParams(window.location.search).get("route") ?? "/"]
  : undefined;

const root = document.getElementById("root")!;

function HydrationMarker() {
  useEffect(() => {
    root.dataset.oreeHydrated = "true";
  }, []);
  return null;
}

const app = (
  <StrictMode>
    <HydrationMarker />
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppErrorBoundary>
          <Router {...(initialEntries ? { initialEntries } : {})}>
            <App />
          </Router>
        </AppErrorBoundary>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
);

if (root.hasChildNodes()) {
  // Motion settles a few inline styles after the first client render. React can
  // recover that harmless presentation-only difference without logging a
  // production hydration error or changing the settled visual output.
  hydrateRoot(root, app, { onRecoverableError: () => undefined });
} else {
  createRoot(root).render(app);
}
