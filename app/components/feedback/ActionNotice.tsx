import { CheckCircle2, Info, X } from "lucide-react";
import { cn } from "@/lib/cn";

type ActionNoticeProps = {
  title: string;
  description?: string;
  tone?: "success" | "info";
  onClose?: () => void;
  className?: string;
};

export function ActionNotice({ title, description, tone = "success", onClose, className }: ActionNoticeProps) {
  const Icon = tone === "success" ? CheckCircle2 : Info;

  return (
    <div
      role="status"
      className={cn(
        "flex items-start gap-3 rounded-[22px] border p-4",
        tone === "success"
          ? "border-[var(--mint)] bg-[var(--mint-soft)]"
          : "border-[var(--blue)]/20 bg-[var(--blue)]/8",
        className,
      )}
    >
      <span className={cn("grid size-9 shrink-0 place-items-center rounded-full", tone === "success" ? "bg-[var(--mint)]" : "bg-white text-[color:var(--blue)]")}>
        <Icon className="size-4" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold">{title}</p>
        {description ? <p className="mt-1 text-xs leading-5 text-[color:var(--muted)]">{description}</p> : null}
      </div>
      {onClose ? (
        <button type="button" onClick={onClose} className="grid size-8 shrink-0 place-items-center rounded-full transition hover:bg-white" aria-label="Fermer la notification">
          <X className="size-4" />
        </button>
      ) : null}
    </div>
  );
}
