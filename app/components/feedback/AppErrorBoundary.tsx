import { Component, type ErrorInfo, type ReactNode } from "react";

export class AppErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (import.meta.env.DEV) console.error("[Orée] Erreur d’interface", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="grid min-h-screen place-items-center bg-[var(--paper)] px-5 text-[color:var(--ink)]">
          <section className="max-w-lg rounded-[2rem] border border-[var(--line)] bg-white p-8 text-center shadow-soft">
            <p className="text-xs font-bold uppercase tracking-[.22em] text-[color:var(--blue)]">Incident d’affichage</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-[-.04em]">La page n’a pas pu terminer son chargement.</h1>
            <p className="mt-3 text-sm leading-6 text-[color:var(--muted)]">Vos informations n’ont pas été supprimées. Rechargez la page pour reprendre votre parcours.</p>
            <button className="mt-6 h-12 rounded-full bg-[var(--ink)] px-6 text-sm font-semibold text-white" onClick={() => window.location.reload()}>
              Recharger la page
            </button>
          </section>
        </main>
      );
    }
    return this.props.children;
  }
}
