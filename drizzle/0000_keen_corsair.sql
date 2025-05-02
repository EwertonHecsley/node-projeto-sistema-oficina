CREATE TABLE "clients" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"docType" text NOT NULL,
	"email" text NOT NULL,
	"phone" text NOT NULL,
	"city" text NOT NULL,
	"juridicalPerson" boolean NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "clients_docType_unique" UNIQUE("docType"),
	CONSTRAINT "clients_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "vehicles" (
	"id" uuid PRIMARY KEY NOT NULL,
	"client_id" uuid,
	"plate" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "vehicles_plate_unique" UNIQUE("plate")
);
--> statement-breakpoint
ALTER TABLE "vehicles" ADD CONSTRAINT "vehicles_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE no action ON UPDATE no action;