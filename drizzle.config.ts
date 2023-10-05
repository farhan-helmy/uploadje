import type { Config } from "drizzle-kit";

export default {
  schema: "./src/db/schema/*",
  driver: 'pg',
  out: "./src/db/drizzle",
  dbCredentials: {
    connectionString: process.env.DB_URL!,
  }
} satisfies Config;
