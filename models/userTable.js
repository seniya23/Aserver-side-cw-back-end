import db from "../config/database.js";

db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    firstName TEXT NOT NULL,
    lastName TEXT NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'user',
    isBlocked INTEGER DEFAULT 0,
    image TEXT DEFAULT 'default.jpg'
  )
`);

export default db;