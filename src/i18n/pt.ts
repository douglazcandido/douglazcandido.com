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
    previous: "Projeto anterior",
    next: "Próximo projeto",
    projectsRegion: "Projetos",
    openImage: "Ampliar imagem",
    prevImage: "Imagem anterior",
    nextImage: "Próxima imagem",
    closeImage: "Fechar",
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
          "Robôs de web scraping coletaram dados que viabilizaram novas estratégias de venda e aumentaram as vendas de forma considerável",
          "Robôs em Python eliminaram tarefas repetitivas e consultas manuais em sistemas de bancos parceiros",
          "Tratamento de grandes bases de mailing para discador, SMS e URA",
          "Relatórios e planilhas no Google Sheets para análise de vendas e controle de custos",
        ],
      },
      {
        title: "Analista de Dados",
        period: "abr/2024 - jan/2026",
        items: [
          "Primeiro banco relacional da empresa, no lugar de CSVs despadronizados: mais controle da base de mailing e consultas mais ágeis, com app em Streamlit para uso sem perfil técnico",
          "Pipeline ETL que automatizou a atualização mensal de contratos, antes feita à mão e muito demorada",
          "Dashboard em Power BI para análise de propostas, do modelo de dados e ETL ao painel",
          "Workflows no n8n que automatizam o funil de leads, do chatbot à proposta final, com agente de IA no fluxo",
          "Robôs RPA, integrações REST com bancos e fintechs e APIs próprias em Flask",
        ],
      },
      {
        title: "Supervisor de TI",
        period: "jan/2026 - hoje",
        items: [
          "Líder técnico do time de engenharia",
          "Arquitetura AWS do sistema usado por toda a empresa e por parceiros, pensada para performance e economia",
          "APIs REST em FastAPI, com JWT e documentação, e logs padronizados em todas as features",
          "Scrum e CI/CD: tudo versionado em Git, com deploy automatizado, inclusive migrations",
          "Novo fluxo de dados que reduziu drasticamente o custo de enriquecimento e atualização de dados",
          "Módulos de RH, financeiro e funil de leads (até a qualificação) feitos de ponta a ponta",
          "Treinamentos de uso e boas práticas do sistema para os usuários",
        ],
      },
    ],
  },
  projects: {
    title: "Projetos",
    repoCta: "Ver no GitHub",
    privateCode: "Código privado",
    items: [
      {
        title: "Atlas Corban: CRM para crédito consignado",
        description:
          "A maior dor de uma financeira de crédito consignado é o trabalho operacional, e o Atlas foi feito para tirar isso das costas da equipe. A integração com bancos e fintechs deixa a simulação e a digitação de contratos simples para o usuário, e o restante do operacional roda de forma totalmente automatizada. Em volta disso, o sistema unifica as áreas da empresa: leads, financeiro e comissões, RH e dashboards. Tudo sob medida para a operação, em uma arquitetura modular na AWS.",
        tags: ["PostgreSQL", "MongoDB", "Redis", "FastAPI", "SQLAlchemy", "ETL", "Node", "React", "AWS", "CI/CD", "Docker"],
        private: true,
      },
      {
        title: "Camada de analytics desacoplada da operação",
        description:
          "Arquitetura de dados em padrão medallion (bruto, validado, analítico) na AWS, publicando eventos para um banco de analytics dedicado. Isso permite relatórios e dashboards de negócio sem tocar ou impactar o banco transacional em produção.",
        tags: ["AWS", "Medallion", "Eventos", "Analytics"],
      },
      {
        title: "Sentinel: previsão de incidentes de TI e risco de OLA",
        description:
          "Aplicação completa que prevê o volume de incidentes e o risco de violação de OLA a partir de 122 mil registros, desenvolvida no desafio de AIOps da Locaweb com a FIAP. Pipeline medalhão em PostgreSQL com dbt e Airflow, três modelos de ML (previsão, risco com explicabilidade e clusters), API FastAPI com JWT e painel em React. CI/CD no GitHub Actions, com testes do pipeline e deploy automático via SSH em uma VPS Linux.",
        tags: ["PostgreSQL", "dbt", "Airflow", "Machine Learning", "FastAPI", "SQLAlchemy", "ETL", "React", "CI/CD", "Docker"],
        repo: "https://github.com/douglazcandido/sentinel-aiops",
        media: "sentinel",
        shotAlts: [
          "Tela de login do Sentinel",
          "Painel principal com total de incidentes, violações de OLA e previsão para o dia seguinte",
          "Histórico com gráficos de volume por hora, dia da semana e prioridade",
          "Previsão de incidentes para o dia seguinte e para os próximos 7 dias",
          "Risco de OLA com distribuição de risco, metas e explicabilidade do modelo",
          "Padrões de comportamento identificados por clusterização (K-Means)",
          "Recomendações geradas por regras de negócio",
          "Exportação dos dados em CSV e Excel",
        ],
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
