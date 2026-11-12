import login from "../assets/projects/sentinel/01-login.png";
import dashboard from "../assets/projects/sentinel/02-dashboard.png";
import historico from "../assets/projects/sentinel/03-historico.png";
import previsao from "../assets/projects/sentinel/04-previsao.png";
import riscoOla from "../assets/projects/sentinel/05-risco-ola.png";
import padroes from "../assets/projects/sentinel/06-padroes.png";
import recomendacoes from "../assets/projects/sentinel/07-recomendacoes.png";
import exportacao from "../assets/projects/sentinel/08-exportacao.png";

/**
 * Screenshots per project, keyed by the `media` field of a project in the i18n files.
 * Order matters: the alt texts (`shotAlts`) follow the same order.
 */
export const projectMedia: Record<string, readonly string[]> = {
  sentinel: [login, dashboard, historico, previsao, riscoOla, padroes, recomendacoes, exportacao],
};
