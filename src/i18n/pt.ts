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
      "Construo pipelines que aguentam volume, da ingestão à informação, com observabilidade e custo sob controle.",
  },
  about: {
    title: "Sobre",
    lead: "Há mais de 4 anos trabalho na integração com bancos e fintechs, hoje como Supervisor de TI. No dia a dia, isso significa desenhar pipelines de dados, construir APIs e resolver problemas reais de performance em produção.",
    accent: ["bancos", "fintechs", "pipelines", "APIs", "performance", "produção"],
    body: "Trabalho de ponta a ponta: modelagem de dados, orquestração de pipelines e serviços em Python. Gosto de sistemas explícitos, testados e documentados.",
    statYears: "Integrando bancos e fintechs",
    statYearsUnit: "anos",
    statDb: "Base PostgreSQL otimizada",
    statDbWas: "era 112 GB",
    statTools: "Ferramentas na stack",
  },
  projects: {
    title: "Projetos",
    intro:
      "Tipos de problema que já resolvi na prática, sem entrar em detalhes específicos de cliente ou empresa.",
    before: "antes",
    after: "depois",
    metricCaption: "tamanho da base após a reestruturação",
    radarTitle: ["Mapa de ", "experiência", ""],
    radarScale: "escala 0 a 10",
    axes: [
      "Engenharia de Dados",
      "Automação & Integração",
      "Backend & APIs",
      "Cloud & Infraestrutura",
      "Machine Learning",
    ],
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
        title: "Coleta de dados via web scraping",
        description:
          "Extração automatizada de dados de fontes externas sem API disponível, com scripts resilientes a mudanças de layout e rotinas programadas de coleta.",
        tags: ["Python", "Web scraping", "Rotinas agendadas"],
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
    text: "Dados & pipelines, backend, automação e cloud: as ferramentas que compõem minha stack. Role a página para acelerar as fileiras.",
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
