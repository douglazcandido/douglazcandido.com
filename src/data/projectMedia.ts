import dashboard from "../assets/projects/sentinel/dashboard.png";
import historico from "../assets/projects/sentinel/historico.png";
import riscoOla from "../assets/projects/sentinel/risco-ola.png";
import recomendacoes from "../assets/projects/sentinel/recomendacoes.png";
import login from "../assets/projects/sentinel/login.png";

/**
 * Screenshots per project, keyed by the `media` field of a project in the i18n files.
 * Order matters: the alt texts (`shotAlts`) follow the same order.
 */
export const projectMedia: Record<string, readonly string[]> = {
  sentinel: [dashboard, historico, riscoOla, recomendacoes, login],
};
