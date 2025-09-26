import { defineConfig } from "drizzle-kit";
import { env } from "./src/config/env";

export default defineConfig({
  schema: "./src/database/schema/*.ts",
  out: "./src/database/migrations",
  dialect: "mysql",
  dbCredentials: {
    host: env.DB_HOST,
    port: env.DB_PORT,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
  },
  verbose: true,
  strict: true,
});
