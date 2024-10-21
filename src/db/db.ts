import "dotenv/config";
import pg from "pg";
const { Pool } = pg;
import { drizzle } from "drizzle-orm/node-postgres";
import config from "../config/db";
import * as schema1 from "./schema/user";
import * as schema2 from "./schema/note";
import * as schema3 from "./schema/tag";
// TODO: seperate tags and notes_tags into different files

const pool = new Pool(config);
const db = drizzle(pool, { schema: { ...schema1, ...schema2, ...schema3 } });

export default db;
