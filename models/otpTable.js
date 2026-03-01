import db from "../config/database.js";

db.run(`
  CREATE TABLE IF NOT EXISTS otp (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    otp TEXT NOT NULL
  )
`);

export default db;