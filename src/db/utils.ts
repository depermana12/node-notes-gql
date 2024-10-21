import { timestamp } from "drizzle-orm/pg-core";

const timestamps = {
  created_at: timestamp().defaultNow().notNull(),
  updated_at: timestamp(),
};

export default timestamps;
