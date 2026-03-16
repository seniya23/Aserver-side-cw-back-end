import db from "../config/database.js";

db.run(`
  CREATE TABLE IF NOT EXISTS bidding (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    firstName TEXT NOT NULL,
    lastName TEXT NOT NULL,
    image TEXT,
    bidAmount INTEGER NOT NULL,
    status TEXT DEFAULT 'pending',
    winAmount INTEGER NOT NULL
  )
`);

export default db;