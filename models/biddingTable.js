import db from "../config/database.js";

db.run(`
  CREATE TABLE IF NOT EXISTS bidding (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL,
    firstName TEXT NOT NULL,
    lastName TEXT NOT NULL,
    image TEXT,
    bidAmount INTEGER NOT NULL,
    status TEXT DEFAULT 'active',
    winAmount INTEGER DEFAULT 0,
    bidDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    month INTEGER,
    year INTEGER
  )
`);

export default db;
