CREATE TABLE IF NOT EXISTS "folders" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"parent_folder_id" text,
	"app_id" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "secrets" (
	"id" text PRIMARY KEY NOT NULL,
	"secret_key" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	"deleted_at" timestamp,
	"app_id" text,
	CONSTRAINT "secrets_secret_key_unique" UNIQUE("secret_key")
);
--> statement-breakpoint
ALTER TABLE "apps" DROP CONSTRAINT "apps_app_secret_unique";--> statement-breakpoint
ALTER TABLE "apps" ADD COLUMN "name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "images" ADD COLUMN "key" text NOT NULL;--> statement-breakpoint
ALTER TABLE "images" ADD COLUMN "folder_id" text;--> statement-breakpoint
ALTER TABLE "apps" DROP COLUMN IF EXISTS "app_secret";--> statement-breakpoint
ALTER TABLE "images" DROP COLUMN IF EXISTS "app_id";--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_email_unique" UNIQUE("email");