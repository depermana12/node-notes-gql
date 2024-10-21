import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./src/drizzle",
  schema: "./src/db/schema",
  dialect: "postgresql",
  dbCredentials: {
    user: process.env.DB_USER!,
    host: process.env.DB_HOST!,
    database: process.env.DB_NAME!,
    password: process.env.DB_PASSWORD!,
    port: Number(process.env.DB_PORT)!,
    ssl: false,
  },
});
