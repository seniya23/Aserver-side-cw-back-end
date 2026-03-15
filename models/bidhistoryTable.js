import db from "../config/database.js";

db.run(`
  CREATE TABLE IF NOT EXISTS bidhistory (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    firstName TEXT NOT NULL,
    lastName TEXT NOT NULL,
    bidAmount INTEGER NOT NULL,
    bidDate DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

export default db;