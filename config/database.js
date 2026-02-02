import sqlite3 from "sqlite3";

const db = new sqlite3.Database("./database.db", (err) => {
  if (err) {
    console.error("Error opening database", err.message);
  } else {
    console.log("Connected to SQLite database");
  }
});

export default db;