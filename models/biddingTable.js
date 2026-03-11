import db from "../config/database.js";

db.run(`
  CREATE TABLE IF NOT EXISTS bidding (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL,
    firstName TEXT NOT NULL,
    lastName TEXT NOT NULL,
    image TEXT,
    bidAmount INTEGER NOT NULL,
    bidTime DATETIME DEFAULT CURRENT_TIMESTAMP,
    status TEXT DEFAULT 'open',
    month INTEGER,
    year INTEGER
  )
`);

export default db;