ALTER TABLE "symbols" ALTER COLUMN "exchange" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "symbols" ALTER COLUMN "exchange_short_name" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "symbols" ALTER COLUMN "price" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "symbols" ALTER COLUMN "type" DROP NOT NULL;