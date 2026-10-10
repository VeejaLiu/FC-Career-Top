-- Preserve year-specific fields and optional career data without discarding
-- new fields introduced by future game/editor updates.
ALTER TABLE player ADD COLUMN player_profile TEXT;
