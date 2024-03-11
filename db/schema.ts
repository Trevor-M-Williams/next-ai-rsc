import { serial, text, timestamp, pgTable, jsonb } from "drizzle-orm/pg-core";

export const stocks = pgTable("stocks", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  data: jsonb("data").$type<StockChartData[]>(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
