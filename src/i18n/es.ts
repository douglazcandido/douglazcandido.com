import type { Dict } from "./pt";

export const es: Dict = {
  meta: {
    title: "Douglas Candido | Ingeniero de Datos y Backend",
    description:
      "Douglas Candido, Ingeniero de Datos y Backend. Pipelines, APIs e infraestructura de datos en producción.",
  },
  a11y: {
    progress: "Progreso de la página",
    toLightTheme: "Activar tema claro",
    toDarkTheme: "Activar tema oscuro",
    lightTheme: "Tema claro",
    darkTheme: "Tema oscuro",
    language: "Idioma",
    tools: "Herramientas y tecnologías",
  },
  nav: {
    about: "sobre mí",
    career: "carrera",
    projects: "proyectos",
    skills: "habilidades",
    education: "educación",
    contact: "contacto",
    home: "inicio",
    menu: "menú",
    close: "cerrar",
  },
  hero: {
    summary:
      "Ingeniero de datos y software. Del modelo de datos al deploy: modelado, pipeline, API e infraestructura.",
  },
  about: {
    title: "Sobre mí",
    paragraphs: [
      "Trabajo con ingeniería y arquitectura de datos y con backend de aplicaciones web. Mi experiencia es práctica: automatización de procesos, integración de sistemas, pipelines ETL, paneles analíticos y agentes de IA.",
      "Hoy soy Supervisor de TI y lidero al equipo responsable de los sistemas críticos de captación y distribución de datos. Además de la gestión, diseño arquitecturas escalables en AWS y consolido sistemas fragmentados en stacks unificados y stateless.",
      "Soy egresado en Ciencia de Datos de FIAP, donde estudié modelado de datos, ingeniería de datos y modelos predictivos, como series temporales, clasificación y clustering.",
    ],
  },
  career: {
    title: "Carrera",
    items: [
      {
        title: "Asistente Administrativo",
        period: "sep/2022 - abr/2024",
        items: [
          "Robots de web scraping recopilaron datos que permitieron nuevas estrategias de venta y aumentaron las ventas de forma considerable",
          "Robots en Python eliminaron tareas repetitivas y consultas manuales en sistemas de bancos socios",
          "Tratamiento de grandes bases de mailing para discador, SMS y URA",
          "Informes y hojas de cálculo en Google Sheets para análisis de ventas y control de costos",
        ],
      },
      {
        title: "Analista de Datos",
        period: "abr/2024 - ene/2026",
        items: [
          "Primera base de datos relacional de la empresa, en lugar de CSVs sin estandarizar: más control de la base de mailing y consultas más ágiles, con una app en Streamlit para uso sin perfil técnico",
          "Pipeline ETL que automatizó la actualización mensual de contratos, antes hecha a mano y muy lenta",
          "Dashboard en Power BI para análisis de propuestas, del modelo de datos y ETL al panel",
          "Workflows en n8n que automatizan el embudo de leads, del chatbot a la propuesta final, con un agente de IA en el flujo",
          "Robots RPA, integraciones REST con bancos y fintechs y APIs propias en Flask",
        ],
      },
      {
        title: "Supervisor de TI",
        period: "ene/2026 - hoy",
        items: [
          "Arquitectura AWS del sistema de la empresa, implantada en todos los sectores",
          "Pipelines batch y en tiempo real; consolidación de stacks",
          "Scrum y CI/CD",
          "Reducción de costos en cloud, telecom y enriquecimiento de datos",
        ],
      },
    ],
  },
  projects: {
    title: "Proyectos",
    intro:
      "Tipos de problemas que ya resolví en la práctica, sin entrar en detalles específicos de clientes o empresas.",
    before: "antes",
    after: "después",
    metricCaption: "tamaño de la base tras la reestructuración",
    items: [
      {
        title: "Ingesta, procesamiento e integración de leads en tiempo casi real",
        description:
          "Un pipeline que recibe leads de múltiples fuentes externas, cada una con su propio formato de datos y contrato de API. Identifica el formato automáticamente, valida y deduplica antes de la segmentación. Se integra con varias APIs externas en paralelo, cada una con su propio límite de solicitudes y formato de respuesta, maneja fallas parciales y procesa de forma asíncrona en AWS para soportar picos de volumen sin degradarse.",
        tags: ["AWS", "Asíncrono", "APIs externas", "Deduplicación"],
      },
      {
        title: "Capa de analytics desacoplada de la operación",
        description:
          "Arquitectura de datos con patrón medallion (bruto, validado, analítico) en AWS, que publica eventos en una base de analytics dedicada. Así se pueden generar reportes y dashboards de negocio sin tocar ni afectar la base transaccional en producción.",
        tags: ["AWS", "Medallion", "Eventos", "Analytics"],
      },
      {
        title: "Liderazgo en la implementación de un sistema para una promotora de crédito con descuento en nómina",
        description:
          "Lideré un equipo en la implementación de un sistema completo para una promotora de crédito con descuento en nómina, coordinando el trabajo desde el levantamiento de requisitos hasta el despliegue en producción, pasando por backend, integraciones externas y modelado de base de datos.",
        tags: ["Liderazgo", "Backend", "Integraciones", "Despliegue"],
      },
      {
        title: "Optimización de bases de datos de producción a gran escala",
        description:
          "Diagnóstico y rediseño del modelado en bases PostgreSQL en AWS con decenas de millones de registros. La reestructuración de esquema, tipos de datos e índices redujo una base de 112GB a 15GB, además de la reescritura de consultas complejas sin downtime.",
        tags: ["PostgreSQL", "AWS", "Esquema", "Índices"],
      },
      {
        title: "Desarrollo de backend y APIs",
        description:
          "Servicios y APIs en Python/FastAPI, alojados en AWS, con autenticación, validación de datos y procesamiento asíncrono, que sostienen los sistemas internos que la operación usa todos los días.",
        tags: ["Python", "FastAPI", "AWS", "Autenticación"],
      },
      {
        title: "Detección de anomalías y predicción de fallas (AIOps)",
        description:
          "Orquestación de un pipeline de datos con múltiples modelos de machine learning (series temporales y clustering) servidos por API, con un panel de gestión para seguir las predicciones y exportar resultados. Proyecto académico en alianza FIAP × Locaweb.",
        tags: ["Machine Learning", "Series temporales", "Clustering", "FIAP × Locaweb"],
      },
    ],
  },
  skills: {
    title: "Habilidades",
    text: "Datos y pipelines, backend, automatización y cloud: las herramientas que componen mi stack.",
  },
  education: {
    title: "Educación",
    items: [
      { title: "Tecnólogo en Ciencia de Datos", school: "FIAP" },
      { title: "Técnico en Redes de Computadoras", school: "ETEC" },
      { title: "Técnico en Desarrollo de Sistemas", school: "ETEC" },
    ],
  },
  contact: {
    title: "Hablemos",
    rights: "Todos los derechos reservados.",
  },
};
