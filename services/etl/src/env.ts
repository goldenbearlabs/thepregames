import { z } from "zod";

const schema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  APP_ENV: z.enum(["development", "staging", "production"]).default("development"),
  POSTGRES_URL: z.string().url().optional(),
  POSTGRES_POOL_URL: z.string().url().optional()
}).refine(v => v.POSTGRES_POOL_URL || v.POSTGRES_URL, {
  message: "Provide POSTGRES_POOL_URL or POSTGRES_URL"
});

const parsed = schema.safeParse(process.env);
if (!parsed.success) {
  console.error("❌ Invalid ETL env:", parsed.error.flatten().fieldErrors);
  throw new Error("Invalid ETL environment variables");
}

export const env = parsed.data;
// Use pooler if present, else direct
export const DB_URL = env.POSTGRES_POOL_URL ?? env.POSTGRES_URL!;
