import {
  CompanyData,
  IndustryData,
  BalanceSheet,
  CashFlowStatement,
  IncomeStatement,
  StockChartData,
} from "@/types";

import {
  serial,
  text,
  timestamp,
  pgTable,
  jsonb,
  integer,
} from "drizzle-orm/pg-core";

export const companies = pgTable("companies", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  symbol: text("symbol").notNull(),
  companyData: jsonb("company_data").$type<CompanyData>(),
  industryData: jsonb("industry_data").$type<IndustryData>(),
  competitors: jsonb("competitors").$type<string[]>(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  organizationId: integer("organization_id")
    .references(() => organizations.id)
    .notNull(),
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

export const organizations = pgTable("organizations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  symbol: text("symbol").notNull(),
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
