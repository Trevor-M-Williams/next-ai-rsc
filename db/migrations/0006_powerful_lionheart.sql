CREATE TABLE IF NOT EXISTS "companies" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"data" jsonb,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
