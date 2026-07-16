import { useEffect } from "react";

export function usePageMeta(title: string, description: string) {
  useEffect(() => {
    document.title = `${title} — Orée`;
    const existing = document.querySelector('meta[name="description"]');
    if (existing) existing.setAttribute("content", description);
    else {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content = description;
      document.head.appendChild(meta);
    }
  }, [description, title]);
}
