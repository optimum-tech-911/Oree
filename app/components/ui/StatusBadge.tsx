import { cn } from "@/lib/cn";

const statusStyles: Record<string, string> = {
  required: "bg-white text-[color:var(--ink)] border-[var(--line-strong)]",
  uploaded: "bg-[var(--blue)]/8 text-[color:var(--blue)] border-[var(--blue)]/20",
  under_review: "bg-[var(--ink)] text-white border-[var(--ink)]",
  changes_requested: "bg-[var(--blue)] text-white border-[var(--blue)]",
  approved: "bg-[var(--mint-soft)] text-[color:var(--ink)] border-[var(--mint)]",
  signed: "bg-[var(--ink)] text-white border-[var(--ink)]",
};

const labels: Record<string, string> = {
  required: "À fournir",
  uploaded: "Téléversé",
  under_review: "En vérification",
  changes_requested: "Correction demandée",
  approved: "Validé",
  signed: "Signé",
};

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  return <span className={cn("inline-flex rounded-full border px-2.5 py-1 text-xs font-extrabold", statusStyles[status] ?? "bg-white text-[color:var(--ink)] border-[var(--line)]", className)}>{labels[status] ?? status}</span>;
}
