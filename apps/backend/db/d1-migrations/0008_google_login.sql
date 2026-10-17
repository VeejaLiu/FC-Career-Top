-- Stable Google account identifiers are separate from mutable email addresses.
ALTER TABLE user ADD COLUMN google_sub TEXT;
CREATE UNIQUE INDEX user_google_sub_unique ON user(google_sub) WHERE google_sub IS NOT NULL;
