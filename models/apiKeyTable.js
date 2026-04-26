import db from "../config/database.js";

db.run(`
  CREATE TABLE IF NOT EXISTS api_keys (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    key TEXT UNIQUE NOT NULL,
    client_name TEXT NOT NULL,
    permissions TEXT NOT NULL, -- JSON array of permissions
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_active INTEGER DEFAULT 1
  )
`);

export default db;