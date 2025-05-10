CREATE TABLE "mechanics" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"cpf" text NOT NULL,
	"isAvaliable" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "mechanics_email_unique" UNIQUE("email"),
	CONSTRAINT "mechanics_cpf_unique" UNIQUE("cpf")
);
