import type { Dict } from "./pt";

export const es: Dict = {
  meta: {
    title: "Douglas Candido | Ingeniero de Datos y Software",
    description:
      "Ingeniero de datos y software. Del modelo de datos al despliegue: modelado, pipeline, API e infraestructura.",
  },
  a11y: {
    progress: "Progreso de la página",
    toLightTheme: "Activar tema claro",
    toDarkTheme: "Activar tema oscuro",
    lightTheme: "Tema claro",
    darkTheme: "Tema oscuro",
    language: "Idioma",
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
    skills: "Stack tecnológico",
    contact: "contacto",
    home: "inicio",
    menu: "menú",
    close: "cerrar",
  },
  hero: {
    summary:
      "Ingeniero de datos y software. Del modelo de datos al despliegue: modelado, pipeline, API e infraestructura.",
  },
  about: {
    title: "Sobre mí",
    paragraphs: [
      "Trabajo con ingeniería y arquitectura de datos y con backend de aplicaciones web. Mi experiencia es práctica: automatización de procesos, integración de sistemas, pipelines ETL, paneles analíticos y agentes de IA.",
      "Hoy soy Supervisor de TI y lidero el equipo responsable de los sistemas críticos de captación y distribución de datos. Además de la gestión, diseño arquitecturas escalables en AWS y consolido sistemas fragmentados en stacks unificados y stateless.",
      "Soy titulado en Ciencia de Datos por FIAP, donde estudié modelado de datos, ingeniería de datos y modelos predictivos, como series temporales, clasificación y clustering.",
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
          "Robots en Python eliminaron tareas repetitivas y consultas manuales en sistemas de bancos colaboradores",
          "Tratamiento de grandes bases de mailing para marcador automático, SMS e IVR",
          "Informes y hojas de cálculo en Google Sheets para análisis de ventas y control de costes",
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
        period: "ene/2026 - actualidad",
        items: [
          "Líder técnico del equipo de ingeniería",
          "Arquitectura AWS del sistema usado por toda la empresa y por empresas colaboradoras, pensada para rendimiento y ahorro",
          "APIs REST en FastAPI, con JWT y documentación, y logs estandarizados en todas las funcionalidades",
          "Scrum y CI/CD: todo versionado en Git, con despliegue automatizado, incluidas las migraciones",
          "Nuevo flujo de datos que redujo drásticamente el coste de enriquecimiento y actualización de datos",
          "Módulos de RR. HH., finanzas y embudo de leads (hasta la cualificación) hechos de principio a fin",
          "Sesiones de formación sobre el uso y las buenas prácticas del sistema para los usuarios",
        ],
      },
    ],
    professionalLabel: "Profesional",
    academicLabel: "Académico",
    academic: [
      {
        period: "2020 - 2021",
        title: "Técnico en Desarrollo de Sistemas",
        school: "ETEC",
        note: "",
        items: [
          "Bases de datos relacionales, del modelado a las consultas",
          "Aplicaciones web, de la base de datos a la interfaz",
          "Aplicaciones de escritorio en Visual Studio y aplicaciones móviles",
        ],
      },
      {
        period: "2022 - 2023",
        title: "Técnico en Redes de Ordenadores",
        school: "ETEC",
        note: "",
        items: [
          "Protocolos, capas y arquitectura de redes, además de los tipos de cableado",
          "Direccionamiento IP, subredes y switching",
          "Redes inalámbricas e Internet de las Cosas (IoT)",
          "Servidores DNS, DHCP y de ficheros, y administración de Linux (Ubuntu y Debian)",
        ],
      },
      {
        period: "2025 - 2026",
        title: "Tecnólogo en Ciencia de Datos",
        school: "FIAP",
        note: "Titulación de educación superior en Brasil",
        items: [
          "Modelado de datos, SQL y NoSQL, incluidos modelos de datos distribuidos",
          "Ingeniería y arquitectura de datos, con Big Data",
          "Machine learning y deep learning: series temporales, clasificación y clustering",
          "Visión artificial: reconocimiento de imágenes y OCR",
          "Programación en Python, con POO, Git y Docker",
          "Entrega de 6 proyectos MVP durante la formación",
        ],
      },
    ],
    certs: {
      title: "Cursos y certificaciones",
      names: {
        "data-viz": "Cualificación Profesional en Análisis y Visualización de Datos",
        "analytics-bigdata": "Cualificación Profesional en Arquitectura de Analytics y Big Data",
        "data-quality": "Cualificación Profesional en Modelado, Programación y Calidad de Datos",
        bi: "Business Intelligence (BI)",
        cybersecurity: "Cybersecurity",
      },
      months: ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"],
      verify: "Verificar",
      lookup: "Verificar",
      codeLabel: "Código",
      copyCode: "Copiar código",
      copied: "Copiado",
    },
  },
  projects: {
    title: "Proyectos",
    repoCta: "Ver en GitHub",
    privateCode: "Código privado",
    items: [
      {
        title: "Atlas Corban: CRM para crédito con descuento en nómina",
        description:
          "El mayor quebradero de cabeza de una financiera de crédito con descuento en nómina es el trabajo operativo, y Atlas se hizo para quitárselo de encima al equipo. La integración con bancos y fintechs hace sencillas para el usuario la simulación y la tramitación de contratos, y el resto de la operación funciona de forma totalmente automatizada. En torno a eso, el sistema unifica las áreas de la empresa: leads, finanzas y comisiones, RR. HH. y dashboards. Todo a medida para la operación, en una arquitectura modular en AWS.",
        tags: ["AWS", "CI/CD", "Docker", "ETL", "FastAPI", "MongoDB", "Node", "PostgreSQL", "React", "Redis", "SQLAlchemy"],
        private: true,
      },
      {
        title: "Mailing Manager: segmentación de bases de leads",
        description:
          "Todos los días, quien trabaja con crédito necesita separar de la base de leads el grupo correcto para cada campaña de WhatsApp, SMS, marcador automático o IVR. Mailing Manager lo hace sin exigir ningún conocimiento técnico: el usuario crea filtros dinámicos o elige una segmentación ya preparada, los “cortes de base” para cada perfil, y descarga una hoja de cálculo ya formateada tal y como la necesita la operación. Por detrás hay una base relacional con más de 90 millones de registros, modelada para el negocio, con consultas dinámicas optimizadas y un ETL mensual que mantiene actualizados los datos de contrato y margen de los leads.",
        tags: ["AWS", "CI/CD", "Docker", "ETL", "FastAPI", "PostgreSQL", "Psycopg2", "React", "SQLAlchemy"],
        private: true,
      },
      {
        title: "Sentinel: predicción de incidentes de TI y riesgo de OLA",
        description:
          "Aplicación completa que predice el volumen de incidentes y el riesgo de incumplir un OLA a partir de 122.000 registros, desarrollada en el reto de AIOps de Locaweb con FIAP. Pipeline medallón en PostgreSQL con dbt y Airflow, tres modelos de ML (predicción, riesgo con explicabilidad y clusters), API FastAPI con JWT y panel en React. CI/CD en GitHub Actions, con pruebas del pipeline y despliegue automático por SSH en un VPS Linux.",
        tags: ["Airflow", "CI/CD", "dbt", "Docker", "ETL", "FastAPI", "Machine Learning", "PostgreSQL", "React", "SQLAlchemy"],
        repo: "https://github.com/douglazcandido/sentinel-aiops",
        media: "sentinel",
        shotAlts: [
          "Pantalla de inicio de sesión de Sentinel",
          "Panel principal con total de incidentes, incumplimientos del OLA y previsión para el día siguiente",
          "Historial con gráficos de volumen por hora, día de la semana y prioridad",
          "Previsión de incidentes para el día siguiente y para los próximos 7 días",
          "Riesgo de OLA con distribución de riesgo, objetivos y explicabilidad del modelo",
          "Patrones de comportamiento identificados mediante clustering (K-Means)",
          "Recomendaciones generadas por reglas de negocio",
          "Exportación de datos a CSV y Excel",
        ],
      },
    ],
  },
  skills: {
    title: "Stack tecnológico",
    groups: {
      languages: "Lenguajes",
      data: "Datos y pipelines",
      storage: "Bases de datos y almacenamiento",
      web: "Backend y frontend",
      cloud: "Cloud y DevOps",
      automation: "Automatización, BI y ML",
    },
  },
  contact: {
    title: "Hablemos",
    rights: "Todos los derechos reservados.",
  },
};
