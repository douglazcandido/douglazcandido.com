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
    previous: "Proyecto anterior",
    next: "Siguiente proyecto",
    projectsRegion: "Proyectos",
    openImage: "Ampliar imagen",
    prevImage: "Imagen anterior",
    nextImage: "Imagen siguiente",
    closeImage: "Cerrar",
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
          "Líder técnico del equipo de ingeniería",
          "Arquitectura AWS del sistema usado por toda la empresa y por socios, pensada para rendimiento y ahorro",
          "APIs REST en FastAPI, con JWT y documentación, y logs estandarizados en todas las features",
          "Scrum y CI/CD: todo versionado en Git, con despliegue automatizado, incluidas las migrations",
          "Nuevo flujo de datos que redujo drásticamente el costo de enriquecimiento y actualización de datos",
          "Módulos de RR. HH., finanzas y embudo de leads (hasta la calificación) hechos de punta a punta",
          "Capacitaciones de uso y buenas prácticas del sistema para los usuarios",
        ],
      },
    ],
  },
  projects: {
    title: "Proyectos",
    repoCta: "Ver en GitHub",
    privateCode: "Código privado",
    items: [
      {
        title: "Atlas Corban: CRM para crédito con descuento en nómina",
        description:
          "El mayor dolor de una financiera de crédito con descuento en nómina es el trabajo operativo, y Atlas fue hecho para sacarle eso de encima al equipo. La integración con bancos y fintechs vuelve simple para el usuario la simulación y la digitación de contratos, y el resto de la operación corre de forma totalmente automatizada. Alrededor de eso, el sistema unifica las áreas de la empresa: leads, finanzas y comisiones, RR. HH. y dashboards. Todo a medida para la operación, en una arquitectura modular en AWS.",
        tags: ["PostgreSQL", "MongoDB", "Redis", "FastAPI", "Node", "React", "AWS", "CI/CD", "Docker"],
        private: true,
      },
      {
        title: "Capa de analytics desacoplada de la operación",
        description:
          "Arquitectura de datos con patrón medallion (bruto, validado, analítico) en AWS, que publica eventos en una base de analytics dedicada. Así se pueden generar reportes y dashboards de negocio sin tocar ni afectar la base transaccional en producción.",
        tags: ["AWS", "Medallion", "Eventos", "Analytics"],
      },
      {
        title: "Sentinel: predicción de incidentes de TI y riesgo de OLA",
        description:
          "Aplicación completa que predice el volumen de incidentes y el riesgo de incumplir un OLA a partir de 122 mil registros, desarrollada en el desafío de AIOps de Locaweb con FIAP. Pipeline medallón en PostgreSQL con dbt y Airflow, tres modelos de ML (predicción, riesgo con explicabilidad y clusters), API FastAPI con JWT y panel en React. CI/CD en GitHub Actions, con pruebas del pipeline y despliegue automático por SSH en una VPS Linux.",
        tags: ["PostgreSQL", "dbt", "Airflow", "Machine Learning", "FastAPI", "React", "CI/CD", "Docker"],
        repo: "https://github.com/douglazcandido/sentinel-aiops",
        media: "sentinel",
        shotAlts: [
          "Pantalla de inicio de sesión de Sentinel",
          "Panel principal con total de incidentes, violaciones de OLA y pronóstico del día siguiente",
          "Historial con gráficos de volumen por hora, día de la semana y prioridad",
          "Pronóstico de incidentes para el día siguiente y para los próximos 7 días",
          "Riesgo de OLA con distribución de riesgo, metas y explicabilidad del modelo",
          "Patrones de comportamiento identificados por clusterización (K-Means)",
          "Recomendaciones generadas por reglas de negocio",
          "Exportación de datos a CSV y Excel",
        ],
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
