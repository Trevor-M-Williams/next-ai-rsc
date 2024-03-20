CREATE TABLE IF NOT EXISTS "symbols" (
	"id" serial PRIMARY KEY NOT NULL,
	"symbol" text NOT NULL,
	"exchange" text NOT NULL,
	"exchange_short_name" text NOT NULL,
	"price" text NOT NULL,
	"name" text NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
