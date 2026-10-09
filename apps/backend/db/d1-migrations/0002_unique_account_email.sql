-- Retain older accounts without email; new registrations require email in the API.
CREATE UNIQUE INDEX user_email_unique ON "user"("email" COLLATE NOCASE) WHERE "email" IS NOT NULL;
