import { useEffect, useRef, useState } from "react";
import { FiArrowUpRight, FiCopy } from "react-icons/fi";
import { certifications, type Certification } from "../data/certifications";
import { useI18n } from "../i18n/context";

const PILL =
  "inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 text-[10.5px] tracking-[0.12em] text-accent uppercase transition-colors duration-300 hover:bg-accent/20";

/** Writes to the clipboard; falls back to a hidden textarea where the async API is unavailable. */
async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const area = document.createElement("textarea");
      area.value = text;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      const ok = document.execCommand("copy");
      area.remove();
      return ok;
    } catch {
      return false;
    }
  }
}

function CopyCodeButton({ code }: { code: string }) {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const onClick = async () => {
    if (!(await copyText(code))) return;
    setCopied(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 1100);
  };

  const label = copied ? t.career.certs.copied : t.career.certs.copyCode;

  return (
    <>
      <button
        type="button"
        onClick={onClick}
        aria-label={t.career.certs.copyCode}
        title={label}
        className={`inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-full transition-colors duration-700 ease-out ${
          copied ? "text-accent" : "text-neutral-600 hover:text-neutral-400"
        }`}
      >
        <FiCopy aria-hidden="true" className="h-3.5 w-3.5" />
      </button>
      <span className="sr-only" aria-live="polite">
        {copied ? t.career.certs.copied : ""}
      </span>
    </>
  );
}

function ExternalLink({ href, children }: { href: string; children: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={PILL}>
      {children}
      <FiArrowUpRight aria-hidden="true" className="h-3 w-3" />
    </a>
  );
}

function CertCard({ cert }: { cert: Certification }) {
  const { t } = useI18n();
  const { certs } = t.career;
  const { verification: v } = cert;

  return (
    <li className="spot flex flex-col p-[clamp(14px,1.4vw,20px)]">
      <h4 className="m-0 font-display text-[16px] leading-[1.2] font-semibold tracking-[-0.02em] text-pretty">
        {certs.names[cert.id]}
      </h4>
      <p className="m-0 mt-1 text-[13px] leading-[1.4] text-neutral-500">
        {cert.issuer} · {certs.months[cert.month - 1]}/{cert.year}
      </p>

      <div className="mt-auto flex flex-wrap items-center gap-2 pt-3.5">
        {v.kind === "code" ? (
          <>
            <span className="text-[11px] tracking-[0.16em] text-neutral-500 uppercase">{certs.codeLabel}</span>
            <span className="inline-flex items-center gap-1">
              <span className="text-[13px] tracking-[0.04em] text-neutral-400 select-all">{v.code}</span>
              <CopyCodeButton code={v.code} />
            </span>
            <ExternalLink href={v.url}>{certs.lookup}</ExternalLink>
          </>
        ) : (
          <ExternalLink href={v.url}>{certs.verify}</ExternalLink>
        )}
      </div>
    </li>
  );
}

/** Compact strip of courses under the career timeline. Renders nothing while there are no items. */
export default function CertificationStrip() {
  const { t } = useI18n();
  if (certifications.length === 0) return null;

  return (
    <div className="mt-[clamp(24px,3vw,40px)] border-t border-divider pt-[clamp(16px,1.8vw,24px)]">
      <h3 className="m-0 text-[11px] font-normal tracking-[0.18em] text-neutral-500 uppercase">{t.career.certs.title}</h3>
      <ul className="m-0 mt-5 grid list-none grid-cols-[repeat(auto-fit,minmax(min(100%,236px),1fr))] gap-3 p-0">
        {certifications.map((cert) => (
          <CertCard key={cert.id} cert={cert} />
        ))}
      </ul>
    </div>
  );
}
