import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.coerce.number().default(3000),
  HOST: z.string().default("localhost"),

  // Database
  DB_HOST: z.string().default("localhost"),
  DB_PORT: z.coerce.number().default(3306),
  DB_USER: z.string().default("root"),
  DB_PASSWORD: z.string().default(""),
  DB_NAME: z.string().default("fastify_app"),

  // Rate Limiting
  RATE_LIMIT_MAX: z.coerce.number().default(100),
  RATE_LIMIT_TIME_WINDOW: z.coerce.number().default(60000),

  // OTHER SERVICE
  AAI_API: z.string(),

  // CORS
  CORS_ORIGIN: z.string().default("*"),

  // JWT
  JWT_SECRET_KEY: z.string(),

  // Logging
  LOG_LEVEL: z
    .enum(["fatal", "error", "warn", "info", "debug", "trace"])
    .default("info"),
});

const parseEnv = () => {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.issues.map(
        (err) => `${err.path.join(".")}: ${err.message}`
      );
      throw new Error(`Environment validation failed:\n${errors.join("\n")}`);
    }
    throw error;
  }
};

export const env = parseEnv();
export const isDevelopment = env.NODE_ENV === "development";
