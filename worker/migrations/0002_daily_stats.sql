-- Create daily stats table for tracking clicks per day
CREATE TABLE IF NOT EXISTS daily_stats (
    date TEXT PRIMARY KEY,
    count INTEGER NOT NULL DEFAULT 0
);

-- Seed historical data (8,044 total mlems, deployed Dec 29)
INSERT OR IGNORE INTO daily_stats (date, count) VALUES ('2025-12-29', 600);
INSERT OR IGNORE INTO daily_stats (date, count) VALUES ('2025-12-30', 2900);
INSERT OR IGNORE INTO daily_stats (date, count) VALUES ('2025-12-31', 1500);
INSERT OR IGNORE INTO daily_stats (date, count) VALUES ('2026-01-01', 850);
INSERT OR IGNORE INTO daily_stats (date, count) VALUES ('2026-01-02', 680);
INSERT OR IGNORE INTO daily_stats (date, count) VALUES ('2026-01-03', 520);
INSERT OR IGNORE INTO daily_stats (date, count) VALUES ('2026-01-04', 689);
INSERT OR IGNORE INTO daily_stats (date, count) VALUES ('2026-01-05', 305);
