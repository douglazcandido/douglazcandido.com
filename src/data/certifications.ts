/**
 * Courses and qualifications, shown as a compact strip under the career timeline, in this order.
 * The strip is hidden while this array is empty. The course names live in the dictionaries
 * (`career.certs.names`, keyed by `id`) because they are translated; the issuer is a proper name.
 */
export type CertId = "data-viz" | "analytics-bigdata" | "data-quality" | "bi" | "cybersecurity";

/** How a certificate can be checked: a direct link, or a code typed into the issuer's lookup page. */
export type CertVerification =
  | { kind: "link"; url: string }
  | { kind: "code"; code: string; url: string };

export interface Certification {
  id: CertId;
  issuer: string;
  /** 1 to 12. The label comes from `career.certs.months`. */
  month: number;
  year: number;
  verification: CertVerification;
}

const FIAP_LOOKUP = "https://www.fiap.com.br/consultadocumento";

export const certifications: readonly Certification[] = [
  {
    id: "data-viz",
    issuer: "FIAP",
    month: 6,
    year: 2026,
    verification: { kind: "code", code: "92EAE2AA", url: FIAP_LOOKUP },
  },
  {
    id: "analytics-bigdata",
    issuer: "FIAP",
    month: 12,
    year: 2025,
    verification: { kind: "code", code: "317BD1B1", url: FIAP_LOOKUP },
  },
  {
    id: "data-quality",
    issuer: "FIAP",
    month: 6,
    year: 2025,
    verification: { kind: "code", code: "774596FA", url: FIAP_LOOKUP },
  },
  {
    id: "bi",
    issuer: "FIAP",
    month: 5,
    year: 2024,
    verification: {
      kind: "link",
      url: "https://on.fiap.com.br/local/nanocourses/gerar_certificado.php?chave=2e1ba496cb7aa52ca70a4fd2e5ed838f&action=view",
    },
  },
  {
    id: "cybersecurity",
    issuer: "FIAP",
    month: 10,
    year: 2026,
    verification: {
      kind: "link",
      url: "https://on.fiap.com.br/local/nanocourses/gerar_certificado.php?chave=9322995E0A009A4BA333415194BDF358&action=view",
    },
  },
];
