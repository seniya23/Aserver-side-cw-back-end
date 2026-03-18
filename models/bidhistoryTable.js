import db from "../config/database.js";

db.run(`
  CREATE TABLE IF NOT EXISTS bidhistory (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL,
    firstName TEXT NOT NULL,
    lastName TEXT NOT NULL,
    bidAmount INTEGER NOT NULL,
    bidDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    action TEXT DEFAULT 'placed'
  )
`);

export default db;