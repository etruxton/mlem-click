-- Fix historical data with accurate counts (8,044 total, deployed Dec 29)
DELETE FROM daily_stats;

INSERT INTO daily_stats (date, count) VALUES ('2025-12-29', 600);
INSERT INTO daily_stats (date, count) VALUES ('2025-12-30', 2900);
INSERT INTO daily_stats (date, count) VALUES ('2025-12-31', 1500);
INSERT INTO daily_stats (date, count) VALUES ('2026-01-01', 850);
INSERT INTO daily_stats (date, count) VALUES ('2026-01-02', 680);
INSERT INTO daily_stats (date, count) VALUES ('2026-01-03', 520);
INSERT INTO daily_stats (date, count) VALUES ('2026-01-04', 689);
INSERT INTO daily_stats (date, count) VALUES ('2026-01-05', 305);
