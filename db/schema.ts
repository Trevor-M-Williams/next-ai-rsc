import { serial, text, timestamp, pgTable, jsonb } from "drizzle-orm/pg-core";

export const companies = pgTable("companies", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  companyData: jsonb("data").$type<CompanyData>(),
  industryData: jsonb("industry_data").$type<IndustryData>(),
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

export const stocks = pgTable("stocks", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  data: jsonb("data").$type<StockChartData[]>(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const symbols = pgTable("symbols", {
  id: serial("id").primaryKey(),
  symbol: text("symbol").notNull(),
  exchange: text("exchange"),
  exchangeShortName: text("exchange_short_name"),
  price: text("price"),
  name: text("name"),
  type: text("type"),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
