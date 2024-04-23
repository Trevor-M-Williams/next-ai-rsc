import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";

console.log("DATABASE_URL", process.env.DATABASE_URL);
const sql = neon(process.env.DATABASE_URL as string) as any;

export const db = drizzle(sql, {
  schema,
});
