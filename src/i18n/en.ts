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
          "AWS architecture for the company's system, rolled out across all departments",
          "Batch and real-time pipelines; stack consolidation",
          "Scrum and CI/CD",
          "Cost reduction in cloud, telecom and data enrichment",
        ],
      },
    ],
  },
  projects: {
    title: "Projects",
    intro:
      "The kinds of problems I've solved in practice, without going into client- or company-specific details.",
    before: "before",
    after: "after",
    metricCaption: "database size after the restructuring",
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
        title: "Leading the rollout of a system for a payroll-loan originator",
        description:
          "I led a team in rolling out a complete system for a payroll-loan originator, coordinating the work from requirements gathering all the way to production deployment, across backend, external integrations and database modeling.",
        tags: ["Leadership", "Backend", "Integrations", "Deploy"],
      },
      {
        title: "Large-scale production database optimization",
        description:
          "Diagnosis and redesign of the data model on PostgreSQL databases on AWS holding tens of millions of records. Restructuring schemas, data types and indexes shrank one database from 112GB to 15GB, along with rewriting complex queries with zero downtime.",
        tags: ["PostgreSQL", "AWS", "Schema", "Indexes"],
      },
      {
        title: "Backend and API development",
        description:
          "Python/FastAPI services and APIs hosted on AWS, with authentication, data validation and asynchronous processing, powering the internal systems the operation relies on every day.",
        tags: ["Python", "FastAPI", "AWS", "Authentication"],
      },
      {
        title: "Anomaly detection and failure prediction (AIOps)",
        description:
          "Orchestration of a data pipeline with multiple machine learning models (time series and clustering) served through an API, plus a management dashboard to follow predictions and export results. An academic project in partnership with FIAP × Locaweb.",
        tags: ["Machine Learning", "Time series", "Clustering", "FIAP × Locaweb"],
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
