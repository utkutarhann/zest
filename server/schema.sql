CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  daily_usage_count INT DEFAULT 0,
  last_usage_date DATE DEFAULT CURRENT_DATE,
  role TEXT DEFAULT 'user'
);
