import { z } from "zod";

const serverSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]),
  APP_ENV: z.enum(["development", "staging", "production"]),
  POSTGRES_URL: z.string().url().optional(),
  POSTGRES_POOL_URL: z.string().url().optional(),
  POSTGRES_DIRECT_URL: z.string().url().optional().or(z.literal("")).optional()
}).refine(v => v.POSTGRES_POOL_URL || v.POSTGRES_URL, {
  message: "Provide POSTGRES_POOL_URL or POSTGRES_URL"
});

const clientSchema = z.object({
  NEXT_PUBLIC_FIREBASE_API_KEY: z.string().min(1),
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: z.string().min(1),
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: z.string().min(1),
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: z.string().min(1),
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: z.string().min(1),
  NEXT_PUBLIC_FIREBASE_APP_ID: z.string().min(1),
  NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: z.string().optional(),
  NEXT_PUBLIC_POSTHOG_KEY: z.string().optional(),
  NEXT_PUBLIC_POSTHOG_HOST: z.string().optional()
});

// Parse once at module load so builds fail fast
const _serverEnv = serverSchema.safeParse(process.env);
if (!_serverEnv.success) {
  console.error("❌ Invalid server env:", _serverEnv.error.flatten().fieldErrors);
  throw new Error("Invalid server environment variables");
}

const _clientEnv = clientSchema.safeParse(process.env);
if (!_clientEnv.success) {
  console.error("❌ Invalid client env:", _clientEnv.error.flatten().fieldErrors);
  throw new Error("Invalid client environment variables");
}

// Export typed objects
export const serverEnv = _serverEnv.data;
export const clientEnv = _clientEnv.data;
