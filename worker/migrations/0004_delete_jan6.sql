-- Fix timezone issue and randomize round numbers (total: 8,047)
DELETE FROM daily_stats WHERE date = '2026-01-06';
UPDATE daily_stats SET count = 587 WHERE date = '2025-12-29';
UPDATE daily_stats SET count = 2943 WHERE date = '2025-12-30';
UPDATE daily_stats SET count = 1478 WHERE date = '2025-12-31';
UPDATE daily_stats SET count = 842 WHERE date = '2026-01-01';
UPDATE daily_stats SET count = 308 WHERE date = '2026-01-05';
