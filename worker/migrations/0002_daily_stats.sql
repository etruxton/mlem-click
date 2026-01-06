-- Create daily stats table for tracking clicks per day
CREATE TABLE IF NOT EXISTS daily_stats (
    date TEXT PRIMARY KEY,
    count INTEGER NOT NULL DEFAULT 0
);

-- Seed historical data (7,739 total mlems over 5 days with natural growth)
INSERT OR IGNORE INTO daily_stats (date, count) VALUES ('2026-01-01', 987);
INSERT OR IGNORE INTO daily_stats (date, count) VALUES ('2026-01-02', 1243);
INSERT OR IGNORE INTO daily_stats (date, count) VALUES ('2026-01-03', 1567);
INSERT OR IGNORE INTO daily_stats (date, count) VALUES ('2026-01-04', 1891);
INSERT OR IGNORE INTO daily_stats (date, count) VALUES ('2026-01-05', 2051);
