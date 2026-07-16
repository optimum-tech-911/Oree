import { useEffect } from "react";
import { useReducedMotion } from "motion/react";

export function AmbientPointer() {
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    const root = document.documentElement;
    let frame = 0;
    const onMove = (event: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        root.style.setProperty("--pointer-x", `${event.clientX}px`);
        root.style.setProperty("--pointer-y", `${event.clientY}px`);
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
    };
  }, [reduce]);

  return <div className="ambient-pointer" aria-hidden="true" />;
}
