export interface Project {
  title: string;
  description: string;
}

export interface ExperienceAxis {
  subject: string;
  value: number;
  fullMark: number;
}

export const experienceRadar: ExperienceAxis[] = [
  { subject: "Engenharia de Dados", value: 10, fullMark: 10 },
  { subject: "Automação & Integração", value: 9, fullMark: 10 },
  { subject: "Backend & APIs", value: 8, fullMark: 10 },
  { subject: "Cloud & Infraestrutura", value: 7, fullMark: 10 },
  { subject: "Machine Learning", value: 5, fullMark: 10 },
];

export const projectsIntro =
  "Tipos de problema que já resolvi na prática, sem entrar em detalhes específicos de cliente ou empresa.";

export const projects: Project[] = [
  {
    title: "Ingestão, processamento e integração de leads em tempo quase real",
    description:
      "Pipeline que recebe leads de múltiplas fontes externas, cada uma com layout de dados e contrato de API diferente. Identificação automática de formato, validação e deduplicação antes da segmentação. Integração com várias APIs externas em paralelo, cada uma com seu próprio limite de requisições e formato de resposta, com tratamento de falha parcial e processamento assíncrono na AWS para aguentar picos de volume sem degradar.",
  },
  {
    title: "Camada de analytics desacoplada da operação",
    description:
      "Arquitetura de dados em padrão medallion (bruto, validado, analítico) na AWS, publicando eventos para um banco de analytics dedicado. Isso permite relatórios e dashboards de negócio sem tocar ou impactar o banco transacional em produção.",
  },
  {
    title: "Liderança na implantação de sistema para promotora de crédito consignado",
    description:
      "Liderei uma equipe na implantação de um sistema completo para uma promotora de crédito consignado, coordenando o trabalho desde o levantamento de requisitos até o deploy em produção, passando por backend, integrações externas e modelagem de banco de dados.",
  },
  {
    title: "Otimização de bancos de produção em grande escala",
    description:
      "Diagnóstico e redesenho de modelagem em bases PostgreSQL na AWS com dezenas de milhões de registros. Reestruturação de schema, tipos de dados e índices que reduziu uma base de 112GB para 15GB, além de reescrita de consultas complexas sem downtime.",
  },
  {
    title: "Construção de backend e APIs",
    description:
      "Serviços e APIs em Python/FastAPI, hospedados na AWS, com autenticação, validação de dados e processamento assíncrono, sustentando sistemas internos usados no dia a dia da operação.",
  },
  {
    title: "Coleta de dados via web scraping",
    description:
      "Extração automatizada de dados de fontes externas sem API disponível, com scripts resilientes a mudanças de layout e rotinas programadas de coleta.",
  },
  {
    title: "Detecção de anomalias e previsão de falhas (AIOps)",
    description:
      "Orquestração de pipeline de dados com múltiplos modelos de machine learning (séries temporais e clustering) servidos por API, com painel de gestão para acompanhar previsões e exportar resultados. Projeto acadêmico em parceria FIAP × Locaweb.",
  },
];
