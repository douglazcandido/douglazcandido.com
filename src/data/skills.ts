import airflow from "../assets/logos/airflow.png";
import dbt from "../assets/logos/dbt.png";
import postgresql from "../assets/logos/postgresql.png";
import pyspark from "../assets/logos/pyspark.png";
import redis from "../assets/logos/redis.png";
import mongodb from "../assets/logos/mongodb.png";
import kafka from "../assets/logos/kafka.png";
import python from "../assets/logos/python.png";
import fastapi from "../assets/logos/fastapi.png";
import n8n from "../assets/logos/n8n.png";
import playwright from "../assets/logos/playwright.png";
import duckdb from "../assets/logos/duckdb.png";
import pandas from "../assets/logos/pandas.png";
import aws from "../assets/logos/aws.png";
import docker from "../assets/logos/docker.png";
import git from "../assets/logos/git.png";
import databricks from "../assets/logos/databricks.png";
import powerbi from "../assets/logos/powerbi.png";

export interface Skill {
  name: string;
  logo: string;
  /** Kafka's mark is near-black, so its hover reveal turns white instead of showing its (invisible) original color. */
  whiteOnHover?: boolean;
}

// Ordem agrupada por categoria (sem separadores visuais entre grupos):
// dados & pipelines, backend, automação/testes/análise, cloud & infra.
export const skills: Skill[] = [
  { name: "Airflow", logo: airflow },
  { name: "dbt", logo: dbt },
  { name: "PostgreSQL", logo: postgresql },
  { name: "PySpark", logo: pyspark },
  { name: "Redis", logo: redis },
  { name: "MongoDB", logo: mongodb },
  { name: "Kafka", logo: kafka, whiteOnHover: true },
  { name: "Python", logo: python },
  { name: "FastAPI", logo: fastapi },
  { name: "n8n", logo: n8n },
  { name: "Playwright", logo: playwright },
  { name: "DuckDB", logo: duckdb },
  { name: "Pandas", logo: pandas },
  { name: "AWS", logo: aws },
  { name: "Docker", logo: docker },
  { name: "Git", logo: git },
  { name: "Databricks", logo: databricks },
  { name: "Power BI", logo: powerbi },
];
