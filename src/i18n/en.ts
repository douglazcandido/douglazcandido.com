import type { Dict } from "./pt";

export const en: Dict = {
  meta: {
    title: "Douglas Candido | Data & Backend Engineer",
    description:
      "Douglas Candido, Data & Backend Engineer. Pipelines, APIs and data infrastructure running in production.",
  },
  a11y: {
    progress: "Page progress",
    toLightTheme: "Switch to light theme",
    toDarkTheme: "Switch to dark theme",
    lightTheme: "Light theme",
    darkTheme: "Dark theme",
    language: "Language",
    previous: "Previous project",
    next: "Next project",
    projectsRegion: "Projects",
    openImage: "Enlarge image",
    prevImage: "Previous image",
    nextImage: "Next image",
    closeImage: "Close",
  },
  nav: {
    about: "about",
    career: "career",
    projects: "projects",
    skills: "Tech Stack",
    contact: "contact",
    home: "home",
    menu: "menu",
    close: "close",
  },
  hero: {
    summary:
      "Data and software engineer. From data model to deploy: modeling, pipeline, API and infrastructure.",
  },
  about: {
    title: "About",
    paragraphs: [
      "I work in data engineering and architecture and in web application backend. My experience is hands-on: process automation, systems integration, ETL pipelines, analytics dashboards and AI agents.",
      "Today I am an IT Supervisor and lead the team responsible for the critical systems that capture and distribute data. Beyond management, I design scalable architectures on AWS and consolidate fragmented systems into unified, stateless stacks.",
      "I hold a degree in Data Science from FIAP, where I studied data modeling, data engineering and predictive models such as time series, classification and clustering.",
    ],
  },
  career: {
    title: "Career",
    items: [
      {
        title: "Administrative Assistant",
        period: "Sep/2022 - Apr/2024",
        items: [
          "Web scraping bots collected data that enabled new sales strategies and significantly increased sales",
          "Python bots eliminated repetitive tasks and manual lookups in partner bank systems",
          "Handling large mailing databases for dialer, SMS and IVR campaigns",
          "Reports and spreadsheets in Google Sheets for sales analysis and cost control",
        ],
      },
      {
        title: "Data Analyst",
        period: "Apr/2024 - Jan/2026",
        items: [
          "The company's first relational database, replacing inconsistent CSVs: more control over the mailing base and faster queries, with a Streamlit app for non-technical users",
          "ETL pipeline that automated the monthly contract update, previously done by hand and very time-consuming",
          "Power BI dashboard for proposal analysis, from the data model and ETL to the dashboard",
          "n8n workflows that automate the lead funnel, from the chatbot to the final proposal, with an AI agent in the flow",
          "RPA bots, REST integrations with banks and fintechs, and in-house APIs in Flask",
        ],
      },
      {
        title: "IT Supervisor",
        period: "Jan/2026 - present",
        items: [
          "Technical lead of the engineering team",
          "AWS architecture for the system used across the company and by partners, designed for performance and cost savings",
          "REST APIs in FastAPI, with JWT and documentation, and standardized logs across all features",
          "Scrum and CI/CD: everything versioned in Git, with automated deployment, including migrations",
          "New data flow that drastically reduced the cost of data enrichment and updates",
          "HR, finance and lead funnel modules (up to qualification) built end to end",
          "Training sessions for users on system usage and best practices",
        ],
      },
    ],
    professionalLabel: "Professional",
    academicLabel: "Academic",
    academic: [
      { period: "2020 - 2021", title: "Technical Diploma in Systems Development", school: "ETEC", note: "", description: "" },
      { period: "2022 - 2023", title: "Technical Diploma in Computer Networks", school: "ETEC", note: "", description: "" },
      { period: "2025 - 2026", title: "Technologist Degree in Data Science", school: "FIAP", note: "Brazilian higher-education degree", description: "" },
    ],
    certs: {
      title: "Courses and certifications",
      names: {
        "analytics-bigdata": "Professional Qualification in Analytics and Big Data Architecture",
        "data-quality": "Professional Qualification in Data Modeling, Programming and Data Quality",
        bi: "Business Intelligence (BI)",
        cybersecurity: "Cybersecurity",
      },
      months: ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"],
      verify: "Verify",
      lookup: "Verify",
      codeLabel: "Code",
      copyCode: "Copy code",
      copied: "Copied",
    },
  },
  projects: {
    title: "Projects",
    repoCta: "View on GitHub",
    privateCode: "Private code",
    items: [
      {
        title: "Atlas Corban: CRM for payroll loans",
        description:
          "The biggest pain for a payroll-loan lender is operational work, and Atlas was built to take that off the team's shoulders. The integration with banks and fintechs makes quoting and contract entry simple for the user, and the rest of the operation runs fully automated. Around that, the system unifies the company's areas: leads, finance and commissions, HR and dashboards. All tailored to the operation, in a modular architecture on AWS.",
        tags: ["AWS", "CI/CD", "Docker", "ETL", "FastAPI", "MongoDB", "Node", "PostgreSQL", "React", "Redis", "SQLAlchemy"],
        private: true,
      },
      {
        title: "Mailing Manager: lead base segmentation",
        description:
          "Every day, people working in credit need to pull the right group out of the lead base for each WhatsApp, SMS, dialer or IVR campaign. Mailing Manager does this without requiring any technical knowledge: the user builds dynamic filters or picks a ready-made segmentation, the “base cuts” for each profile, and downloads a spreadsheet already formatted the way the operation needs it. Behind it is a relational database with over 90 million records, modeled for the business, with optimized dynamic queries and a monthly ETL that keeps the leads' contract and margin data up to date.",
        tags: ["AWS", "CI/CD", "Docker", "ETL", "FastAPI", "PostgreSQL", "Psycopg2", "React", "SQLAlchemy"],
        private: true,
      },
      {
        title: "Sentinel: IT incident forecasting and OLA risk",
        description:
          "A complete application that forecasts incident volume and the risk of breaching an OLA from 122,000 records, built for the Locaweb AIOps challenge with FIAP. Medallion pipeline on PostgreSQL with dbt and Airflow, three ML models (forecasting, risk with explainability, and clustering), a FastAPI API with JWT and a React dashboard. CI/CD on GitHub Actions, with pipeline tests and automatic deployment over SSH to a Linux VPS.",
        tags: ["Airflow", "CI/CD", "dbt", "Docker", "ETL", "FastAPI", "Machine Learning", "PostgreSQL", "React", "SQLAlchemy"],
        repo: "https://github.com/douglazcandido/sentinel-aiops",
        media: "sentinel",
        shotAlts: [
          "Sentinel login screen",
          "Main dashboard with incident totals, OLA violations and the next-day forecast",
          "History with charts of volume by hour, weekday and priority",
          "Incident forecast for the next day and the next 7 days",
          "OLA risk with risk distribution, targets and model explainability",
          "Behavior patterns identified by clustering (K-Means)",
          "Recommendations generated from business rules",
          "Data export to CSV and Excel",
        ],
      },
    ],
  },
  skills: {
    title: "Tech Stack",
    groups: {
      languages: "Languages",
      data: "Data & pipelines",
      storage: "Databases & storage",
      web: "Backend & frontend",
      cloud: "Cloud & DevOps",
      automation: "Automation, BI & ML",
    },
  },
  contact: {
    title: "Let's talk",
    rights: "All rights reserved.",
  },
};
