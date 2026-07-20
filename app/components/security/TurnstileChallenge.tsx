import { useEffect, useRef } from "react";
import { turnstileSiteKey } from "@/config/security";

const TURNSTILE_SCRIPT_ID = "oree-turnstile-script";
const TURNSTILE_SCRIPT_URL = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

type TurnstileOptions = {
  sitekey: string;
  action: "submit_lead";
  callback: (token: string) => void;
  "expired-callback": () => void;
  "error-callback": () => void;
  theme: "light";
  size: "flexible";
  language: "fr";
};

type TurnstileApi = {
  render: (container: HTMLElement, options: TurnstileOptions) => string;
  remove: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

let scriptPromise: Promise<void> | null = null;

function loadTurnstile() {
  if (window.turnstile) return Promise.resolve();
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise<void>((resolve, reject) => {
    const existing = document.getElementById(TURNSTILE_SCRIPT_ID) as HTMLScriptElement | null;
    const script = existing ?? document.createElement("script");
    const onLoad = () => {
      script.dataset.loaded = "true";
      if (window.turnstile) resolve();
      else reject(new Error("turnstile_api_unavailable"));
    };
    const onError = () => reject(new Error("turnstile_script_failed"));

    script.addEventListener("load", onLoad, { once: true });
    script.addEventListener("error", onError, { once: true });
    if (!existing) {
      script.id = TURNSTILE_SCRIPT_ID;
      script.src = TURNSTILE_SCRIPT_URL;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
  }).catch((error) => {
    const failedScript = document.getElementById(TURNSTILE_SCRIPT_ID) as HTMLScriptElement | null;
    if (failedScript?.src === TURNSTILE_SCRIPT_URL) failedScript.remove();
    scriptPromise = null;
    throw error;
  });

  return scriptPromise;
}

type TurnstileChallengeProps = {
  onVerify: (token: string) => void;
  onExpire: () => void;
  onUnavailable: () => void;
};

export function TurnstileChallenge({ onVerify, onExpire, onUnavailable }: TurnstileChallengeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const onVerifyRef = useRef(onVerify);
  const onExpireRef = useRef(onExpire);
  const onUnavailableRef = useRef(onUnavailable);

  useEffect(() => { onVerifyRef.current = onVerify; }, [onVerify]);
  useEffect(() => { onExpireRef.current = onExpire; }, [onExpire]);
  useEffect(() => { onUnavailableRef.current = onUnavailable; }, [onUnavailable]);

  useEffect(() => {
    if (!turnstileSiteKey) return;
    let active = true;
    let widgetId: string | null = null;

    void loadTurnstile()
      .then(() => {
        if (!active || !containerRef.current || !window.turnstile) return;
        widgetId = window.turnstile.render(containerRef.current, {
          sitekey: turnstileSiteKey,
          action: "submit_lead",
          callback: (token) => { if (active) onVerifyRef.current(token); },
          "expired-callback": () => { if (active) { onVerifyRef.current(""); onExpireRef.current(); } },
          "error-callback": () => { if (active) onUnavailableRef.current(); },
          theme: "light",
          size: "flexible",
          language: "fr",
        });
      })
      .catch(() => { if (active) onUnavailableRef.current(); });

    return () => {
      active = false;
      if (widgetId && window.turnstile) window.turnstile.remove(widgetId);
    };
  }, []);

  if (!turnstileSiteKey) return null;

  return (
    <div
      ref={containerRef}
      data-testid="turnstile-challenge"
      aria-label="Vérification anti-robot"
      className="min-h-[65px] w-full overflow-hidden rounded-[16px]"
    />
  );
}
