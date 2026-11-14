import type { Dict } from "../i18n/pt";

/** Key of each group's title in the dictionary (`skills.groups`). */
export type SkillGroupId = keyof Dict["skills"]["groups"];

export interface SkillGroup {
  id: SkillGroupId;
  /** Technology names are proper nouns: they are never translated. */
  items: readonly string[];
}

// Display order. No item appears in more than one group.
export const skillGroups: readonly SkillGroup[] = [
  { id: "languages", items: ["Python", "SQL", "TypeScript"] },
  { id: "data", items: ["Airflow", "dbt", "Pandas", "DuckDB", "Spark", "Databricks", "Kafka"] },
  { id: "storage", items: ["PostgreSQL", "MongoDB", "Redis", "Supabase", "S3"] },
  { id: "web", items: ["FastAPI", "Node", "Flask", "SQLAlchemy", "Alembic", "JWT", "React", "Tailwind"] },
  {
    id: "cloud",
    items: [
      "AWS (ECS, EC2, Lambda, SQS, RDS, ElastiCache, API Gateway, CloudFront, IAM)",
      "Docker",
      "Git",
      "GitHub Actions",
      "Linux",
    ],
  },
  { id: "automation", items: ["n8n", "Playwright", "Streamlit", "Power BI", "scikit-learn", "NeuralProphet"] },
];
