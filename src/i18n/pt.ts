/**
 * Source-of-truth dictionary (pt-BR). `Dict` is derived from it, so `en.ts`
 * and `es.ts` fail to compile if any key is missing.
 */
export const pt = {
  meta: {
    title: "Douglas Candido | Engenheiro de Dados e Software",
    description:
      "Engenheiro de dados e software. Do modelo de dados ao deploy: modelagem, pipeline, API e infraestrutura.",
  },
  a11y: {
    progress: "Progresso da página",
    toLightTheme: "Ativar tema claro",
    toDarkTheme: "Ativar tema escuro",
    lightTheme: "Tema claro",
    darkTheme: "Tema escuro",
    language: "Idioma",
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
    skills: "Stack",
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
    professionalLabel: "Profissional",
    academicLabel: "Acadêmico",
    academic: [
      {
        period: "2020 - 2021",
        title: "Técnico em Desenvolvimento de Sistemas",
        school: "ETEC",
        note: "",
        items: [
          "Bancos de dados relacionais, da modelagem às consultas",
          "Aplicações web, do banco de dados à interface",
          "Aplicações desktop no Visual Studio e aplicativos mobile",
        ],
      },
      {
        period: "2022 - 2023",
        title: "Técnico em Redes de Computadores",
        school: "ETEC",
        note: "",
        items: [
          "Protocolos, camadas e arquitetura de redes, além dos tipos de cabeamento",
          "Endereçamento IP, sub-redes e switching",
          "Redes sem fio e Internet das Coisas (IoT)",
          "Servidores DNS, DHCP e de arquivos, e administração de Linux (Ubuntu e Debian)",
        ],
      },
      {
        period: "2025 - 2026",
        title: "Tecnólogo em Ciência de Dados",
        school: "FIAP",
        note: "",
        items: [
          "Modelagem de dados, SQL e NoSQL, incluindo modelos de dados distribuídos",
          "Engenharia e arquitetura de dados, com Big Data",
          "Machine learning e deep learning: séries temporais, classificação e clusterização",
          "Visão computacional: reconhecimento de imagens e OCR",
          "Programação em Python, com POO, Git e Docker",
          "Entrega de 6 projetos MVP durante a formação",
        ],
      },
    ],
    certs: {
      title: "Cursos e certificações",
      names: {
        "data-viz": "Qualificação Profissional em Análise e Visualização de Dados",
        "analytics-bigdata": "Qualificação Profissional em Arquitetura de Analytics e Big Data",
        "data-quality": "Qualificação Profissional em Modelagem, Programação e Qualidade de Dados",
        bi: "Business Intelligence (BI)",
        cybersecurity: "Cybersecurity",
      },
      months: ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"],
      verify: "Verificar",
      lookup: "Verificar",
      codeLabel: "Código",
      copyCode: "Copiar código",
      copied: "Copiado",
    },
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
        tags: ["AWS", "CI/CD", "Docker", "ETL", "FastAPI", "MongoDB", "Node", "PostgreSQL", "React", "Redis", "SQLAlchemy"],
        private: true,
      },
      {
        title: "Mailing Manager: segmentação de bases de leads",
        description:
          "Todo dia, quem trabalha com crédito precisa separar da base de leads o grupo certo para cada campanha de WhatsApp, SMS, discador ou URA. O Mailing Manager faz isso sem exigir nenhum conhecimento técnico: o usuário monta filtros dinâmicos ou escolhe uma segmentação pronta, os “cortes de base” para cada perfil, e baixa uma planilha já formatada do jeito que a operação precisa. Por trás está um banco relacional com mais de 90 milhões de registros, modelado para o negócio, com queries dinâmicas otimizadas e um ETL mensal que mantém atualizados os dados de contrato e margem dos leads.",
        tags: ["AWS", "CI/CD", "Docker", "ETL", "FastAPI", "PostgreSQL", "Psycopg2", "React", "SQLAlchemy"],
        private: true,
      },
      {
        title: "Sentinel: previsão de incidentes de TI e risco de OLA",
        description:
          "Aplicação completa que prevê o volume de incidentes e o risco de violação de OLA a partir de 122 mil registros, desenvolvida no desafio de AIOps da Locaweb com a FIAP. Pipeline medalhão em PostgreSQL com dbt e Airflow, três modelos de ML (previsão, risco com explicabilidade e clusters), API FastAPI com JWT e painel em React. CI/CD no GitHub Actions, com testes do pipeline e deploy automático via SSH em uma VPS Linux.",
        tags: ["Airflow", "CI/CD", "dbt", "Docker", "ETL", "FastAPI", "Machine Learning", "PostgreSQL", "React", "SQLAlchemy"],
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
    title: "Stack",
    groups: {
      languages: "Linguagens",
      data: "Dados & pipelines",
      storage: "Bancos & armazenamento",
      web: "Backend & frontend",
      cloud: "Cloud & DevOps",
      automation: "Automação, BI & ML",
    },
  },
  contact: {
    title: "Vamos conversar",
    rights: "Todos os direitos reservados.",
  },
};

export type Dict = typeof pt;
