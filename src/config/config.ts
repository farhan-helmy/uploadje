import { z } from "zod";
import dotenv from "dotenv";
import path from "path";
import { logger } from "./logger";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const envSchema = z.object({
  PORT: z.string().nonempty(),
  JWT_SECRET: z.string().nonempty(),
  DB_URL: z.string().nonempty(),
  AWS_ACCESS_KEY_ID: z.string().nonempty(),
  AWS_SECRET_ACCESS_KEY: z.string().nonempty(),
});

try {
  envSchema.parse(process.env);
} catch (error) {
  if (error instanceof z.ZodError) {
    logger.error("Error parsing environment variables:", error.errors);
    console.error("Error parsing environment variables:", error.errors);
    process.exit(1);
  }
  logger.error("Something went wrong:", error);
  process.exit(1); // Exit the application with a non-zero code to indicate failure
}
