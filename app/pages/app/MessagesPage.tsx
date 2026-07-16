import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUp, FileText, Info, MessageCircleMore, Paperclip, Search } from "lucide-react";
import { ActionNotice } from "@/components/feedback/ActionNotice";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { AppPageHero } from "@/components/app/AppPageHero";
import { mockMessages } from "@/data/mock";
import { usePageMeta } from "@/hooks/usePageMeta";
import { createId } from "@/lib/id";

const conversations = [
  { id: "team", title: "Équipe Orée", initials: "OR", preview: "Le justificatif doit être récent." },
  { id: "system", title: "Notifications système", initials: "SY", preview: "Orientation enregistrée." },
] as const;

export default function MessagesPage() {
  const [messages, setMessages] = useState(mockMessages);
  const [input, setInput] = useState("");
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<"team" | "system">("team");
  const [attachment, setAttachment] = useState<string | null>(null);
  const [contextOpen, setContextOpen] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  usePageMeta("Messages", "Échangez avec l'équipe chargée du projet et conservez le contexte du dossier.");

  function send() {
    const body = input.trim();
    if (!body && !attachment) return;
    const messageBody = [body, attachment ? `Pièce jointe préparée : ${attachment}` : ""].filter(Boolean).join("\n");
    setMessages((current) => [...current, { id: createId(), author: "Vous", initials: "PP", time: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }), body: messageBody }]);
    setInput("");
    setAttachment(null);
  }

  const filteredConversations = conversations.filter((conversation) => `${conversation.title} ${conversation.preview}`.toLocaleLowerCase("fr-FR").includes(query.toLocaleLowerCase("fr-FR")));

  return <div className="mx-auto max-w-[1200px] space-y-5"><AppPageHero icon={MessageCircleMore} eyebrow="Messagerie du projet" title={<>Des échanges conservés <span className="gradient-text">dans leur contexte.</span></>} description="Chaque conversation reste liée aux documents, aux décisions et aux actions du dossier, afin de préserver une information complète et vérifiable." stat={{ value: "1", label: "Message non lu" }} />{attachment ? <ActionNotice tone="info" title={`${attachment} prêt à être joint`} description="Le fichier reste dans votre navigateur jusqu'à l'envoi du message." onClose={() => setAttachment(null)} /> : null}<Card className="grid min-h-[720px] overflow-hidden lg:grid-cols-[290px_1fr]">
    <aside className="hidden border-r border-[var(--line)] bg-[var(--paper)] lg:block"><div className="border-b border-[var(--line)] p-4"><Badge>Conversations</Badge><label className="mt-4 flex h-10 items-center gap-2 rounded-full border border-[var(--line)] bg-white px-3 text-sm text-[color:var(--muted)]"><Search className="size-4" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Rechercher" className="min-w-0 flex-1 bg-transparent outline-none" /></label></div><div className="p-2">{filteredConversations.map((conversation) => <button key={conversation.id} type="button" onClick={() => setActive(conversation.id)} className={`w-full rounded-[20px] p-3 text-left transition ${active === conversation.id ? "bg-white shadow-sm" : "hover:bg-white/65"}`}><div className="flex gap-3"><span className={`grid size-11 shrink-0 place-items-center rounded-full text-xs font-bold ${conversation.id === "team" ? "bg-[var(--mint)]" : "bg-[var(--blue)]/8 text-[color:var(--blue)]"}`}>{conversation.initials}</span><div className="min-w-0 flex-1"><p className="text-sm font-semibold">{conversation.title}</p><p className="mt-1 truncate text-xs text-[color:var(--muted)]">{conversation.preview}</p></div></div></button>)}{filteredConversations.length === 0 ? <p className="p-4 text-center text-xs text-[color:var(--muted)]">Aucune conversation trouvée.</p> : null}</div></aside>
    <div className="flex min-h-0 flex-col">{active === "system" ? <div className="grid flex-1 place-items-center bg-[var(--paper)] p-6"><div className="max-w-md text-center"><span className="mx-auto grid size-14 place-items-center rounded-[20px] bg-[var(--blue)]/8 text-[color:var(--blue)]"><Info className="size-5" /></span><h2 className="mt-5 text-2xl font-semibold">Notifications système</h2><p className="mt-3 text-sm leading-7 text-[color:var(--muted)]">L'orientation SASU a été enregistrée comme hypothèse de travail. Deux points restent à valider avant toute décision définitive.</p><Link to="/app/orientation" className="mt-6 inline-flex rounded-full bg-[var(--ink)] px-5 py-3 text-sm font-semibold text-white">Consulter l'orientation</Link></div></div> : <><header className="flex items-center justify-between border-b border-[var(--line)] px-5 py-4"><div className="flex items-center gap-3"><span className="grid size-11 place-items-center rounded-full bg-[var(--mint)] text-xs font-bold">OR</span><div><p className="font-semibold">Équipe Orée</p><p className="mt-0.5 flex items-center gap-1.5 text-xs text-[color:var(--muted)]"><span className="size-1.5 rounded-full bg-[var(--mint)]" />Suivi du projet</p></div></div><button type="button" onClick={() => setContextOpen((value) => !value)} className="grid size-10 place-items-center rounded-full border border-[var(--line)]" aria-label="Afficher le contexte de la conversation" aria-expanded={contextOpen}><Info className="size-4" /></button></header>{contextOpen ? <div className="border-b border-[var(--line)] bg-[var(--mint-soft)] px-5 py-4 text-sm leading-6 text-[color:var(--muted)]">Cette conversation concerne le contrôle documentaire du projet Studio Horizon. Les réponses affichées sont des données de démonstration et ne constituent pas un conseil personnalisé.</div> : null}
      <div className="assistant-scroll flex-1 overflow-y-auto bg-[var(--paper)] p-5 sm:p-7"><div className="mx-auto max-w-3xl space-y-5"><div className="flex justify-center"><span className="rounded-full border border-[var(--line)] bg-white px-3 py-1.5 text-[10px] font-semibold text-[color:var(--muted)]">Aujourd'hui</span></div>{messages.map((message) => <div key={message.id} className={`flex gap-3 ${message.author === "Vous" ? "flex-row-reverse" : ""}`}><span className={`grid size-9 shrink-0 place-items-center rounded-full text-[10px] font-bold ${message.author === "Vous" ? "bg-[var(--blue)] text-white" : "bg-[var(--mint)]"}`}>{message.initials}</span><div className={`max-w-[78%] whitespace-pre-line rounded-[22px] px-4 py-3 text-sm leading-6 shadow-sm ${message.author === "Vous" ? "rounded-tr-md bg-[var(--ink)] text-white" : "rounded-tl-md bg-white text-[color:var(--ink)]"}`}><p>{message.body}</p><p className={`mt-2 text-[10px] ${message.author === "Vous" ? "text-white/72" : "text-[color:var(--muted)]"}`}>{message.time}</p></div></div>)}<Link to="/app/documents" className="block rounded-[22px] border border-[var(--line)] bg-white p-4 transition hover:border-[var(--blue)]/25"><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-2xl bg-[var(--paper)]"><FileText className="size-4" /></span><div className="flex-1"><p className="text-sm font-semibold">Justificatif de siège</p><p className="mt-1 text-xs text-[color:var(--muted)]">Correction demandée · consulter le document</p></div></div></Link></div></div>
      <div className="border-t border-[var(--line)] bg-white p-4"><div className="mx-auto flex max-w-3xl items-end gap-2 rounded-[22px] border border-[var(--line)] bg-[var(--paper)] p-2 pl-3 focus-within:border-[var(--blue)]"><button type="button" onClick={() => fileInput.current?.click()} className="grid size-10 shrink-0 place-items-center rounded-full text-[color:var(--muted)] hover:bg-white" aria-label="Joindre un fichier"><Paperclip className="size-4" /></button><input ref={fileInput} type="file" hidden accept=".pdf,.png,.jpg,.jpeg,.webp" onChange={(event) => setAttachment(event.target.files?.[0]?.name ?? null)} /><textarea rows={1} value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); send(); } }} placeholder="Rédiger un message…" className="max-h-28 min-h-10 flex-1 resize-none bg-transparent py-2 text-sm outline-none" /><button type="button" onClick={send} disabled={!input.trim() && !attachment} className="grid size-10 shrink-0 place-items-center rounded-full bg-[var(--ink)] text-white disabled:opacity-35" aria-label="Envoyer le message"><ArrowUp className="size-4" /></button></div></div></>}
    </div>
  </Card></div>;
}
