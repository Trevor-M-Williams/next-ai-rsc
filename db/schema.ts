import { serial, text, timestamp, pgTable, jsonb } from "drizzle-orm/pg-core";

export const stocks = pgTable("stocks", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  data: jsonb("data").$type<StockChartData[]>(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const financialStatements = pgTable("financial_statements", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  balanceSheets: jsonb("balance_sheets").$type<BalanceSheet[]>(),
  cashFlowStatements: jsonb("cash_flow_statements").$type<
    CashFlowStatement[]
  >(),
  incomeStatements: jsonb("income_statements").$type<IncomeStatement[]>(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
