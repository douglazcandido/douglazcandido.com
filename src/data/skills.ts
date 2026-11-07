import airflow from "../assets/logos/apache-airflow.png";
import dbt from "../assets/logos/dbt.png";
import spark from "../assets/logos/apache-spark.png";
import databricks from "../assets/logos/databricks.png";
import kafka from "../assets/logos/apache-kafka.png";
import duckdb from "../assets/logos/duckdb.png";
import pandas from "../assets/logos/pandas.png";
import scikitLearn from "../assets/logos/scikit-learn.png";
import postgresql from "../assets/logos/postgresql.png";
import mongodb from "../assets/logos/mongodb.png";
import redis from "../assets/logos/redis.png";
import supabase from "../assets/logos/supabase.png";
import python from "../assets/logos/python.png";
import fastapi from "../assets/logos/fastapi.png";
import sqlalchemy from "../assets/logos/sqlalchemy.png";
import react from "../assets/logos/react.png";
import typescript from "../assets/logos/typescript.png";
import webhook from "../assets/logos/webhook.png";
import websocket from "../assets/logos/websocket.png";
import playwright from "../assets/logos/playwright.png";
import powerbi from "../assets/logos/power-bi.png";
import aws from "../assets/logos/aws.png";
import docker from "../assets/logos/docker.png";
import git from "../assets/logos/git.png";

export interface Skill {
  name: string;
  logo: string;
  /** Logo is dark artwork that vanishes on a dark page: render it as a flat light (dark in light theme) mark. */
  mono?: boolean;
}

// Ordem agrupada por categoria (sem separadores visuais entre grupos):
// dados & pipelines, ML/bancos, backend & web, automação/BI, cloud & infra.
export const skills: Skill[] = [
  { name: "Airflow", logo: airflow },
  { name: "dbt", logo: dbt },
  { name: "Spark", logo: spark },
  { name: "Databricks", logo: databricks },
  { name: "Kafka", logo: kafka, mono: true },
  { name: "DuckDB", logo: duckdb },
  { name: "pandas", logo: pandas, mono: true },
  { name: "scikit-learn", logo: scikitLearn },
  { name: "PostgreSQL", logo: postgresql },
  { name: "MongoDB", logo: mongodb },
  { name: "Redis", logo: redis },
  { name: "Supabase", logo: supabase },
  { name: "Python", logo: python },
  { name: "FastAPI", logo: fastapi },
  { name: "SQLAlchemy", logo: sqlalchemy, mono: true },
  { name: "React", logo: react },
  { name: "TypeScript", logo: typescript },
  { name: "Webhook", logo: webhook },
  { name: "WebSocket", logo: websocket },
  { name: "Playwright", logo: playwright },
  { name: "Power BI", logo: powerbi },
  { name: "AWS", logo: aws, mono: true },
  { name: "Docker", logo: docker },
  { name: "Git", logo: git },
];
