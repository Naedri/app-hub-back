CREATE TABLE "USERS" (
  "id" SERIAL PRIMARY KEY,
  "email" varchar UNIQUE NOT NULL,
  "password" varchar,
  "admin" boolean DEFAULT false
);

CREATE TABLE "APPLICATION" (
  "id" SERIAL PRIMARY KEY,
  "name" varchar UNIQUE NOT NULL,
  "url" varchar
);

CREATE TABLE "SUBSCRIPTION" (
  "id" SERIAL PRIMARY KEY,
  "user_id" int NOT NULL,
  "app_id" int NOT NULL
);

ALTER TABLE "SUBSCRIPTION" ADD FOREIGN KEY ("user_id") REFERENCES "USERS" ("id");

ALTER TABLE "SUBSCRIPTION" ADD FOREIGN KEY ("app_id") REFERENCES "APPLICATION" ("id");
