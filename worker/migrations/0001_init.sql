-- Create the clicks counter table
CREATE TABLE IF NOT EXISTS clicks (
    id INTEGER PRIMARY KEY,
    total INTEGER NOT NULL DEFAULT 0
);

-- Initialize with a single row for the counter (ignore if already exists)
INSERT OR IGNORE INTO clicks (id, total) VALUES (1, 0);
