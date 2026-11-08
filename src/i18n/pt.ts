/**
 * Source-of-truth dictionary (pt-BR). `Dict` is derived from it, so `en.ts`
 * and `es.ts` fail to compile if any key is missing.
 */
export const pt = {
  meta: {
    title: "Douglas Candido | Engenheiro de Dados & Backend",
    description:
      "Douglas Candido, Engenheiro de Dados & Backend. Pipelines, APIs e infraestrutura de dados em produção.",
  },
  a11y: {
    progress: "Progresso da página",
    toLightTheme: "Ativar tema claro",
    toDarkTheme: "Ativar tema escuro",
    lightTheme: "Tema claro",
    darkTheme: "Tema escuro",
    language: "Idioma",
    tools: "Ferramentas e tecnologias",
  },
  nav: {
    about: "sobre",
    career: "carreira",
    projects: "projetos",
    skills: "skills",
    education: "educação",
    contact: "contato",
    home: "início",
    menu: "menu",
    close: "fechar",
  },
  hero: {
    summary:
      "Engenheiro de dados e software. Do modelo de dados ao deploy: modelagem, pipeline, API e infraestrutura.",
  },
  about: {
    title: "Sobre",
    paragraphs: [
      "Atuo com engenharia e arquitetura de dados e com backend de aplicações web. Minha experiência é prática: automação de processos, integração de sistemas, pipelines ETL, painéis analíticos e agentes de IA.",
      "Hoje sou Supervisor de TI e lidero a equipe responsável pelos sistemas críticos de captação e distribuição de dados. Além da gestão, desenho arquiteturas escaláveis na AWS e consolido sistemas fragmentados em stacks unificadas e stateless.",
      "Sou formado em Ciência de Dados pela FIAP, onde estudei modelagem de dados, engenharia de dados e modelos preditivos, como séries temporais, classificação e clusterização.",
    ],
  },
  career: {
    title: "Carreira",
    items: [
      {
        title: "Assistente Administrativo",
        period: "set/2022 - abr/2024",
        items: [
          "Tratamento de grandes bases de mailing para discador, SMS e URA",
          "Robôs em Python para automação e consulta em sistemas de bancos parceiros",
          "Dashboards e relatórios automatizados a partir de dados brutos",
          "Administração de discador, CRM e rotas VoIP",
        ],
      },
      {
        title: "Analista de Dados",
        period: "abr/2024 - jan/2026",
        items: [
          "PostgreSQL de mailings: modelagem, ETL orquestrado e queries de extração",
          "Scrapers com Playwright e integrações REST com bancos parceiros",
          "Fluxo de leads via WhatsApp (WABA)",
          "Power BI sobre data mart de propostas; apps em Streamlit",
        ],
      },
      {
        title: "Supervisor de TI",
        period: "jan/2026 - hoje",
        items: [
          "Arquitetura AWS do sistema da empresa, implantada em todos os setores",
          "Pipelines batch e real-time; consolidação de stacks",
          "Scrum e CI/CD",
          "Redução de custos em cloud, telecom e enriquecimento de dados",
        ],
      },
    ],
  },
  projects: {
    title: "Projetos",
    intro:
      "Tipos de problema que já resolvi na prática, sem entrar em detalhes específicos de cliente ou empresa.",
    before: "antes",
    after: "depois",
    metricCaption: "tamanho da base após a reestruturação",
    items: [
      {
        title: "Ingestão, processamento e integração de leads em tempo quase real",
        description:
          "Pipeline que recebe leads de múltiplas fontes externas, cada uma com layout de dados e contrato de API diferente. Identificação automática de formato, validação e deduplicação antes da segmentação. Integração com várias APIs externas em paralelo, cada uma com seu próprio limite de requisições e formato de resposta, com tratamento de falha parcial e processamento assíncrono na AWS para aguentar picos de volume sem degradar.",
        tags: ["AWS", "Assíncrono", "APIs externas", "Deduplicação"],
      },
      {
        title: "Camada de analytics desacoplada da operação",
        description:
          "Arquitetura de dados em padrão medallion (bruto, validado, analítico) na AWS, publicando eventos para um banco de analytics dedicado. Isso permite relatórios e dashboards de negócio sem tocar ou impactar o banco transacional em produção.",
        tags: ["AWS", "Medallion", "Eventos", "Analytics"],
      },
      {
        title: "Liderança na implantação de sistema para promotora de crédito consignado",
        description:
          "Liderei uma equipe na implantação de um sistema completo para uma promotora de crédito consignado, coordenando o trabalho desde o levantamento de requisitos até o deploy em produção, passando por backend, integrações externas e modelagem de banco de dados.",
        tags: ["Liderança", "Backend", "Integrações", "Deploy"],
      },
      {
        title: "Otimização de bancos de produção em grande escala",
        description:
          "Diagnóstico e redesenho de modelagem em bases PostgreSQL na AWS com dezenas de milhões de registros. Reestruturação de schema, tipos de dados e índices que reduziu uma base de 112GB para 15GB, além de reescrita de consultas complexas sem downtime.",
        tags: ["PostgreSQL", "AWS", "Schema", "Índices"],
      },
      {
        title: "Construção de backend e APIs",
        description:
          "Serviços e APIs em Python/FastAPI, hospedados na AWS, com autenticação, validação de dados e processamento assíncrono, sustentando sistemas internos usados no dia a dia da operação.",
        tags: ["Python", "FastAPI", "AWS", "Autenticação"],
      },
      {
        title: "Detecção de anomalias e previsão de falhas (AIOps)",
        description:
          "Orquestração de pipeline de dados com múltiplos modelos de machine learning (séries temporais e clustering) servidos por API, com painel de gestão para acompanhar previsões e exportar resultados. Projeto acadêmico em parceria FIAP × Locaweb.",
        tags: ["Machine Learning", "Séries temporais", "Clustering", "FIAP × Locaweb"],
      },
    ],
  },
  skills: {
    title: "Skills",
    text: "Dados & pipelines, backend, automação e cloud: as ferramentas que compõem minha stack.",
  },
  education: {
    title: "Educação",
    items: [
      { title: "Tecnólogo em Ciência de Dados", school: "FIAP" },
      { title: "Técnico em Redes de Computadores", school: "ETEC" },
      { title: "Técnico em Desenvolvimento de Sistemas", school: "ETEC" },
    ],
  },
  contact: {
    title: "Vamos conversar",
    rights: "Todos os direitos reservados.",
  },
};

export type Dict = typeof pt;
