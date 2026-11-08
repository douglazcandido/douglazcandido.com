import { useEffect } from "react";
import { profile } from "../data/profile";
import { useI18n } from "../i18n/context";
import { useActiveSection } from "./useActiveSection";

const stops = [
  { id: "inicio", key: "home" },
  { id: "sobre", key: "about" },
  { id: "projetos", key: "projects" },
  { id: "skills", key: "skills" },
  { id: "educacao", key: "education" },
  { id: "contato", key: "contact" },
] as const;

const ids: readonly string[] = stops.map((s) => s.id);

/**
 * Tab title follows the section in view, in the page language:
 * "Sobre | Douglas Candido" ("Início | …" at the top).
 */
export function useDocumentTitle() {
  const { t } = useI18n();
  const active = useActiveSection(ids);

  useEffect(() => {
    const stop = stops.find((s) => s.id === active);
    if (!stop) return;
    const label = t.nav[stop.key];
    document.title = `${label.charAt(0).toUpperCase()}${label.slice(1)} | ${profile.name}`;
  }, [active, t]);
}
