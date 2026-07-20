import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight, Bot, ChevronRight, Command, Compass, FileSearch, ListChecks, Mic, MicOff, Send, X } from "lucide-react";
import { assistantKnowledge, type AssistantKnowledge } from "@/content/knowledge";
import generatedIndex from "@/generated/search-index.json";
import { mobileConversionForPath } from "@/components/layout/MobileConversionBar";
import { readConsent } from "@/features/consent/consent";
import { normalizeText } from "@/lib/format";
import { analytics } from "@/services/analytics";
import { cn } from "@/lib/cn";
import { createId } from "@/lib/id";

type GeneratedRecord = { id: string; text: string; file: string };
type ChatMessage = {
  id: string;
  role: "assistant" | "user";
  text: string;
  actions?: Array<{ label: string; href: string }>;
  source?: string;
};

const quickPrompts = [
  "Quel statut pour créer seul ?",
  "Quels documents dois-je fournir ?",
  "Je suis salarié et je veux me lancer",
  "Où en est mon dossier ?",
];

const synonymGroups = [
  ["rdv", "rendez vous", "rendez-vous", "appel", "creneau"],
  ["papier", "papiers", "piece", "pieces", "document", "documents", "justificatif"],
  ["sasu", "eurl", "seul", "solo", "unipersonnelle"],
  ["sas", "sarl", "associe", "associes", "plusieurs", "deux"],
  ["micro", "auto entrepreneur", "auto-entrepreneur", "independant"],
  ["bloque", "blocage", "rejete", "rejet", "correction", "erreur"],
  ["prix", "cout", "tarif", "frais", "combien"],
  ["avancement", "suivi", "progression", "statut dossier", "etape"],
];

function expandTokens(query: string) {
  const normalized = normalizeText(query);
  const tokens = new Set(normalized.split(" ").filter((token) => token.length > 1));
  for (const group of synonymGroups) {
    if (group.some((item) => normalized.includes(normalizeText(item)))) {
      group.flatMap((item) => normalizeText(item).split(" ")).forEach((item) => tokens.add(item));
    }
  }
  return { normalized, tokens: [...tokens] };
}

function scoreKnowledge(item: AssistantKnowledge, query: string) {
  const { normalized, tokens } = expandTokens(query);
  const haystack = normalizeText(`${item.title} ${item.keywords.join(" ")} ${item.answer}`);
  let score = 0;
  if (haystack.includes(normalized)) score += 30;
  for (const token of tokens) {
    if (normalizeText(item.title).includes(token)) score += 8;
    if (item.keywords.some((keyword) => normalizeText(keyword).includes(token))) score += 6;
    if (haystack.includes(token)) score += 2;
  }
  return score;
}

function scoreGenerated(item: GeneratedRecord, query: string) {
  const { normalized, tokens } = expandTokens(query);
  const haystack = normalizeText(item.text);
  let score = haystack.includes(normalized) ? 15 : 0;
  for (const token of tokens) if (haystack.includes(token)) score += 2;
  return score;
}

function contextualWelcome(pathname: string) {
  if (pathname.startsWith("/app/documents")) return "Je peux retrouver une pièce, expliquer son statut ou ouvrir la prochaine action liée à vos documents.";
  if (pathname.startsWith("/app")) return "Je connais votre espace projet : documents, suivi, messages, associés, formalités et rendez-vous. Dites-moi ce que vous cherchez.";
  if (pathname.includes("sasu")) return "Vous êtes sur le parcours SASU. Je peux la comparer à l'EURL, expliquer les étapes ou lancer le diagnostic avec ce contexte.";
  if (pathname.includes("sarl") || pathname.includes("sas")) return "Je peux comparer les structures, organiser les associés ou retrouver la prochaine étape du parcours.";
  return "Je connais les pages, les parcours, les actions et la documentation de la plateforme. Écrivez ou prononcez simplement ce que vous cherchez.";
}

export function SmartAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [homeHeroVisible, setHomeHeroVisible] = useState(false);
  const [consentResolved, setConsentResolved] = useState(() => Boolean(readConsent()));
  const location = useLocation();
  const navigate = useNavigate();
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const reduce = useReducedMotion();
  const speechSupported = typeof window !== "undefined" && Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
  const records = generatedIndex as GeneratedRecord[];

  const currentKnowledge = useMemo(() => assistantKnowledge.filter((item) => location.pathname.startsWith(item.route)), [location.pathname]);
  const hasMobileConversion = Boolean(mobileConversionForPath(location.pathname));

  function openAssistant() {
    if (!consentResolved) return;
    if (messages.length === 0) setMessages([{ id: createId(), role: "assistant", text: contextualWelcome(location.pathname) }]);
    setOpen(true);
    window.dispatchEvent(new CustomEvent("oree:assistant-visibility", { detail: { open: true } }));
    analytics.track("assistant_opened", { path: location.pathname });
  }

  function closeAssistant() {
    setOpen(false);
    window.dispatchEvent(new CustomEvent("oree:assistant-visibility", { detail: { open: false } }));
  }

  useEffect(() => {
    const updateConsent = () => setConsentResolved(Boolean(readConsent()));
    window.addEventListener("oree:consent-updated", updateConsent);
    return () => {
      window.removeEventListener("oree:consent-updated", updateConsent);
      window.dispatchEvent(new CustomEvent("oree:assistant-visibility", { detail: { open: false } }));
    };
  }, []);

  useEffect(() => {
    const onOpen = () => openAssistant();
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        openAssistant();
      }
      if (event.key === "Escape") closeAssistant();
    };
    window.addEventListener("oree:assistant-open", onOpen);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("oree:assistant-open", onOpen);
      window.removeEventListener("keydown", onKey);
    };
  });

  useEffect(() => {
    if (location.pathname !== "/") return;
    const updatePosition = () => setHomeHeroVisible(window.scrollY < window.innerHeight * .72);
    const frame = window.requestAnimationFrame(updatePosition);
    window.addEventListener("scroll", updatePosition, { passive: true });
    window.addEventListener("resize", updatePosition);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updatePosition);
      window.removeEventListener("resize", updatePosition);
    };
  }, [location.pathname]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
    if (open) window.setTimeout(() => inputRef.current?.focus(), 280);
  }, [messages, open, reduce]);

  function ask(raw: string) {
    const query = raw.trim();
    if (!query) return;
    setMessages((items) => [...items, { id: createId(), role: "user", text: query }]);
    setInput("");
    analytics.track("assistant_search", { queryLength: query.length, path: location.pathname });

    const ranked = assistantKnowledge
      .map((item) => ({ item, score: scoreKnowledge(item, query) + (location.pathname.startsWith(item.route) ? 3 : 0) }))
      .sort((a, b) => b.score - a.score);
    const best = ranked[0];

    if (best && best.score >= 6) {
      const alternatives = ranked.slice(1, 3).filter((entry) => entry.score >= Math.max(5, best.score * .55));
      const actions = [...best.item.actions];
      for (const alternative of alternatives) {
        const action = alternative.item.actions[0];
        if (action && !actions.some((existing) => existing.href === action.href)) actions.push(action);
      }
      window.setTimeout(() => setMessages((items) => [...items, { id: createId(), role: "assistant", text: best.item.answer, actions: actions.slice(0, 3), source: best.item.title }]), 260);
      return;
    }

    const generated = records
      .map((item) => ({ item, score: scoreGenerated(item, query) }))
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    if (generated.length > 0) {
      const excerpts = generated.map((entry) => entry.item.text).join(" ");
      window.setTimeout(() => setMessages((items) => [...items, {
        id: createId(),
        role: "assistant",
        text: `J'ai retrouvé ces éléments dans la plateforme : ${excerpts}`,
        actions: currentKnowledge[0]?.actions ?? [{ label: "Ouvrir le diagnostic", href: "/diagnostic" }],
        source: generated[0]?.item.file,
      }]), 260);
      return;
    }

    window.setTimeout(() => setMessages((items) => [...items, {
      id: createId(),
      role: "assistant",
      text: "Je n'ai pas trouvé une réponse suffisamment précise. Essayez un besoin concret comme « documents », « rendez-vous », « SASU ou EURL », « créer à plusieurs » ou « dossier bloqué ».",
      actions: [{ label: "Voir tous les parcours", href: "/comment-ca-marche" }, { label: "Parler à un conseiller", href: "/rendez-vous" }],
    }]), 260);
  }

  function startVoice() {
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) return;
    const recognition = new Recognition();
    recognition.lang = "fr-FR";
    recognition.interimResults = false;
    recognition.continuous = false;
    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript ?? "";
      setInput(transcript);
      setListening(false);
      if (transcript) ask(transcript);
    };
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);
    setListening(true);
    recognition.start();
  }

  if (!consentResolved) return null;

  return (
    <>
      <motion.button
        type="button"
        onClick={openAssistant}
        whileHover={reduce ? undefined : { y: -4 }}
        className={cn(
          "fixed right-3 z-[70] flex h-12 items-center gap-2 rounded-full border border-white/10 bg-[var(--ink)] px-2.5 text-xs font-semibold text-white shadow-[0_18px_52px_rgba(11,18,32,.28)] transition-all duration-500 sm:right-6",
          location.pathname === "/" && homeHeroVisible
            ? "bottom-[max(1rem,env(safe-area-inset-bottom))] top-auto sm:bottom-auto sm:top-[7rem]"
            : hasMobileConversion
              ? "bottom-[calc(5.75rem+env(safe-area-inset-bottom))] top-auto lg:bottom-6"
              : "bottom-[max(1rem,env(safe-area-inset-bottom))] top-auto lg:bottom-6",
          open && "pointer-events-none scale-90 opacity-0",
        )}
        aria-label="Ouvrir le Guide Orée"
      >
        <span className="relative grid size-8 place-items-center rounded-full bg-[var(--mint)] text-[color:var(--ink)]"><Bot className="size-4" /><span className="assistant-pulse" /></span>
        <span className={cn("assistant-launcher-label hidden pr-1 sm:block", location.pathname === "/" && homeHeroVisible && "sm:hidden")}>Aide</span>
      </motion.button>

      <AnimatePresence>
        {open ? (
          <>
            <motion.button type="button" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeAssistant} className="fixed inset-0 z-[75] bg-[var(--ink)]/50 backdrop-blur-[6px]" aria-label="Fermer l'assistant" />
            <motion.aside
              initial={{ opacity: 0, x: 36, scale: .985 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 36, scale: .985 }}
              transition={{ type: "spring", damping: 30, stiffness: 310 }}
              className="fixed inset-2 z-[80] flex flex-col overflow-hidden rounded-[30px] border border-white/10 bg-[var(--paper)] shadow-[0_50px_160px_rgba(11,18,32,.48)] sm:inset-y-4 sm:left-auto sm:right-4 sm:w-[500px] lg:w-[530px]"
              aria-label="Assistant de navigation Orée"
            >
              <div className="relative overflow-hidden bg-[var(--ink)] p-5 text-white sm:p-6">
                <div className="absolute -right-20 -top-28 size-64 rounded-full bg-[var(--blue)]/35 blur-[75px]" />
                <div className="relative flex items-center justify-between"><div className="flex items-center gap-3"><span className="relative grid size-12 place-items-center rounded-[17px] bg-[var(--mint)] text-[color:var(--ink)]"><Bot className="size-5" /><span className="assistant-pulse" /></span><div><p className="text-lg font-extrabold tracking-[-.035em]">Guide Orée</p><p className="mt-1 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[.12em] text-white/72"><span className="size-1.5 rounded-full bg-[var(--mint)]" />{records.length.toLocaleString("fr-FR")} éléments indexés</p></div></div><button type="button" onClick={closeAssistant} className="grid size-10 place-items-center rounded-full border border-white/10 bg-white/6 text-white/72 transition hover:bg-white/12 hover:text-white"><X className="size-5" /></button></div>
                <div className="relative mt-5 flex items-center gap-2 rounded-[16px] border border-white/8 bg-white/[.04] px-3 py-2.5 text-[10px] text-white/72"><FileSearch className="size-3.5 text-[color:var(--mint)]" />Contexte actuel : <span className="truncate font-extrabold text-white/66">{location.pathname}</span><span className="ml-auto hidden items-center gap-1 rounded-md border border-white/10 px-2 py-1 font-bold sm:flex"><Command className="size-3" />K</span></div>
              </div>

              <div className="assistant-scroll scrollbar-thin flex-1 space-y-4 overflow-y-auto p-4 sm:p-5">
                {messages.map((message) => (
                  <div key={message.id} className={cn("flex", message.role === "user" ? "justify-end" : "justify-start")}>
                    <div className={cn("max-w-[90%] rounded-[22px] px-4 py-3 text-sm leading-6", message.role === "user" ? "rounded-br-md bg-[var(--blue)] text-white shadow-[0_12px_30px_rgba(36,87,255,.18)]" : "rounded-bl-md border border-[var(--line)] bg-white text-[color:var(--ink)] shadow-[0_10px_35px_rgba(11,18,32,.05)]")}>
                      <p>{message.text}</p>
                      {message.actions?.length ? <div className="mt-3 grid gap-2">{message.actions.map((action) => <button key={`${message.id}-${action.href}`} type="button" onClick={() => { navigate(action.href); closeAssistant(); }} className="group flex items-center justify-between gap-3 rounded-[15px] bg-[var(--ink)] px-3.5 py-3 text-left text-xs font-extrabold text-white transition hover:-translate-y-0.5 hover:bg-[var(--blue)]"><span>{action.label}</span><ChevronRight className="size-3.5 transition group-hover:translate-x-1" /></button>)}</div> : null}
                      {message.source ? <p className="mt-2 text-[9px] font-bold uppercase tracking-[.1em] text-[color:var(--muted)]">Source interne · {message.source}</p> : null}
                    </div>
                  </div>
                ))}

                {messages.length <= 1 ? <div className="space-y-4 pt-2"><div className="grid gap-2">{quickPrompts.map((prompt) => <button key={prompt} onClick={() => ask(prompt)} className="group flex items-center justify-between rounded-[18px] border border-[var(--line)] bg-white px-4 py-3.5 text-left text-xs font-extrabold text-[color:var(--ink)] shadow-[0_8px_28px_rgba(11,18,32,.035)] transition hover:-translate-y-0.5 hover:border-[var(--blue)]/28"><span>{prompt}</span><ArrowRight className="size-3.5 text-[color:var(--muted)] transition group-hover:translate-x-1 group-hover:text-[color:var(--blue)]" /></button>)}</div><div className="rounded-[22px] border border-[var(--line)] bg-[var(--ink)] p-4 text-white"><p className="text-[9px] font-extrabold uppercase tracking-[.14em] text-white/72">Ce que je peux faire</p><div className="mt-3 grid grid-cols-3 gap-2">{[{ icon: Compass, label: "Naviguer" }, { icon: FileSearch, label: "Expliquer" }, { icon: ListChecks, label: "Agir" }].map((capability) => { const Icon = capability.icon; return <div key={capability.label} className="rounded-[15px] border border-white/8 bg-white/[.045] p-3"><Icon className="size-4 text-[color:var(--mint)]" /><p className="mt-3 text-[10px] font-extrabold">{capability.label}</p></div>; })}</div><p className="mt-3 text-[9px] leading-4 text-white/72">Je retrouve une page, explique un élément du parcours et propose l'action suivante sans perdre votre contexte.</p></div></div> : null}
                <div ref={bottomRef} />
              </div>

              <form onSubmit={(event) => { event.preventDefault(); ask(input); }} className="border-t border-[var(--line)] bg-white p-3 sm:p-4">
                <div className="flex items-end gap-2 rounded-[21px] border border-[var(--line)] bg-[var(--paper)] p-2 pl-4 transition focus-within:border-[var(--blue)]/42 focus-within:ring-4 focus-within:ring-[var(--blue)]/6">
                  <textarea ref={inputRef} value={input} onChange={(event) => setInput(event.target.value)} rows={1} placeholder="Écrivez ou prononcez ce que vous cherchez…" className="max-h-28 min-h-10 flex-1 resize-none bg-transparent py-2 text-sm text-[color:var(--ink)] outline-none placeholder:text-[color:var(--muted)]" onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); ask(input); } }} />
                  {speechSupported ? <button type="button" onClick={startVoice} className={cn("grid size-10 shrink-0 place-items-center rounded-full transition", listening ? "bg-[var(--blue)] text-white" : "bg-white text-[color:var(--muted)] hover:text-[color:var(--ink)]")} aria-label="Dicter une demande">{listening ? <MicOff className="size-4" /> : <Mic className="size-4" />}</button> : null}
                  <button type="submit" disabled={!input.trim()} className="grid size-10 shrink-0 place-items-center rounded-full bg-[var(--mint)] text-[color:var(--ink)] transition hover:scale-105 disabled:opacity-35"><Send className="size-4" /></button>
                </div>
                <p className="mt-2 text-center text-[9px] font-bold uppercase tracking-[.1em] text-[color:var(--muted)]">Assistant local et auditable · prêt pour une fonction IA Supabase</p>
              </form>
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}
