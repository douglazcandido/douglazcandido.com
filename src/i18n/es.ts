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
      "Construyo pipelines que aguantan volumen de verdad, de la ingesta a la información, con observabilidad y costos bajo control.",
  },
  about: {
    title: "Sobre mí",
    lead: "Hace más de 4 años trabajo en la integración con bancos y fintechs, y hoy soy Supervisor de TI. En el día a día, eso significa diseñar pipelines de datos, construir APIs y resolver problemas reales de rendimiento en producción.",
    accent: ["bancos", "fintechs", "pipelines", "APIs", "rendimiento", "producción"],
    body: "Trabajo de punta a punta: modelado de datos, orquestación de pipelines y servicios en Python. Me gustan los sistemas explícitos, probados y bien documentados.",
    statYears: "Integrando bancos y fintechs",
    statYearsUnit: "años",
    statDb: "Base PostgreSQL optimizada",
    statDbWas: "antes 112 GB",
    statTools: "Herramientas en el stack",
  },
  projects: {
    title: "Proyectos",
    intro:
      "Tipos de problemas que ya resolví en la práctica, sin entrar en detalles específicos de clientes o empresas.",
    before: "antes",
    after: "después",
    metricCaption: "tamaño de la base tras la reestructuración",
    radarTitle: ["Mapa de ", "experiencia", ""],
    radarScale: "escala 0 a 10",
    axes: [
      "Ingeniería de Datos",
      "Automatización e Integración",
      "Backend y APIs",
      "Cloud e Infraestructura",
      "Machine Learning",
    ],
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
        title: "Recolección de datos mediante web scraping",
        description:
          "Extracción automatizada de datos de fuentes externas que no ofrecen API, con scripts resistentes a cambios de diseño y rutinas programadas de recolección.",
        tags: ["Python", "Web scraping", "Tareas programadas"],
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
    text: "Datos y pipelines, backend, automatización y cloud: las herramientas que componen mi stack. Desplázate por la página para acelerar las filas.",
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
    copy: "copiar",
    copied: "copiado",
    copyAria: "Copiar correo",
    copiedAria: "Correo copiado",
    backToTop: "volver arriba",
    rights: "Todos los derechos reservados.",
  },
};
