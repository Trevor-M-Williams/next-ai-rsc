CREATE TABLE IF NOT EXISTS "organizations" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"symbol" text NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "companies" ADD COLUMN "organization_id" integer NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "companies" ADD CONSTRAINT "companies_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
