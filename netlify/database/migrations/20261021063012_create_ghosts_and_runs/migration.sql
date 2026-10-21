CREATE TABLE "ghosts" (
	"id" serial PRIMARY KEY,
	"run_id" text NOT NULL,
	"player_name" text NOT NULL,
	"class_id" text NOT NULL,
	"branch_id" text,
	"round" integer NOT NULL,
	"wins" integer DEFAULT 0 NOT NULL,
	"losses" integer DEFAULT 0 NOT NULL,
	"hp" integer NOT NULL,
	"board" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "runs" (
	"id" serial PRIMARY KEY,
	"run_id" text NOT NULL UNIQUE,
	"player_name" text NOT NULL,
	"class_id" text NOT NULL,
	"branch_name" text,
	"round" integer NOT NULL,
	"wins" integer NOT NULL,
	"losses" integer NOT NULL,
	"score" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "ghosts_round_idx" ON "ghosts" ("round","created_at");--> statement-breakpoint
CREATE INDEX "runs_score_idx" ON "runs" ("score");