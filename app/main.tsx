/* eslint-disable react-refresh/only-export-components */
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
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

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppErrorBoundary>
          <Router {...(initialEntries ? { initialEntries } : {})}>
            <App />
          </Router>
        </AppErrorBoundary>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
);
