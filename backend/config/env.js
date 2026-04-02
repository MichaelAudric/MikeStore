import { z } from "zod";
import dotenv from "dotenv";

dotenv.config(); // Load .env file

// Define the schema for environment variables
const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]),
  PORT: z.string().transform(Number).default("5000"),
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(10),
  CLIENT_URL: z.string().url(),
});

// Parse & validate process.env
const env = envSchema.safeParse(process.env);

if (!env.success) {
  console.error("❌ Invalid environment variables:", env.error.format());
  process.exit(1); // Stop the server
}

export default env.data;
