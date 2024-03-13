CREATE TABLE IF NOT EXISTS "financial_statements" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"balance_sheets" jsonb,
	"cash_flow_statements" jsonb,
	"income_statements" jsonb,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
