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
    tools: "Tools and technologies",
    previous: "Previous project",
    next: "Next project",
    projectsRegion: "Projects",
  },
  nav: {
    about: "about",
    career: "career",
    projects: "projects",
    skills: "skills",
    education: "education",
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
  },
  projects: {
    title: "Projects",
    intro:
      "The kinds of problems I've solved in practice, without going into client- or company-specific details.",
    repoCta: "View the code on GitHub",
    items: [
      {
        title: "Near real-time lead ingestion, processing and integration",
        description:
          "A pipeline that receives leads from multiple external sources, each with its own data layout and API contract. It detects the format automatically, then validates and deduplicates before segmentation. It integrates with several external APIs in parallel, each with its own rate limits and response format, handling partial failures and processing asynchronously on AWS to absorb volume spikes without degrading.",
        tags: ["AWS", "Async", "External APIs", "Deduplication"],
      },
      {
        title: "An analytics layer decoupled from operations",
        description:
          "A medallion-style data architecture (raw, validated, analytical) on AWS, publishing events to a dedicated analytics database. This makes business reports and dashboards possible without touching or slowing down the transactional database in production.",
        tags: ["AWS", "Medallion", "Events", "Analytics"],
      },
      {
        title: "Sentinel: IT incident forecasting and OLA risk",
        description:
          "A complete application that forecasts incident volume and the risk of breaching an OLA from 122,000 records, built for the Locaweb AIOps challenge with FIAP. Medallion pipeline on PostgreSQL with dbt and Airflow, three ML models (forecasting, risk with explainability, and clustering), a FastAPI API with JWT and a React dashboard. CI/CD on GitHub Actions, with pipeline tests and automatic deployment over SSH to a Linux VPS.",
        tags: ["PostgreSQL", "dbt", "Airflow", "Machine Learning", "FastAPI", "React", "CI/CD", "Docker"],
        repo: "https://github.com/douglazcandido/sentinel-aiops",
      },
    ],
  },
  skills: {
    title: "Skills",
    text: "Data & pipelines, backend, automation and cloud: the tools that make up my stack.",
  },
  education: {
    title: "Education",
    items: [
      { title: "Technologist Degree in Data Science", school: "FIAP" },
      { title: "Technical Diploma in Computer Networking", school: "ETEC" },
      { title: "Technical Diploma in Systems Development", school: "ETEC" },
    ],
  },
  contact: {
    title: "Let's talk",
    rights: "All rights reserved.",
  },
};
