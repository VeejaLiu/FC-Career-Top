-- FC 26 and later expose up to seven preferred positions.
ALTER TABLE player ADD COLUMN preferredposition5 TEXT;
ALTER TABLE player ADD COLUMN preferredposition6 TEXT;
ALTER TABLE player ADD COLUMN preferredposition7 TEXT;
