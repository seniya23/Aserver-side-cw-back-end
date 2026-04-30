import db from "../config/database.js";

db.run(`
  CREATE TABLE IF NOT EXISTS alumni_posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    alumniEmail TEXT NOT NULL,
    content TEXT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

export default db;
