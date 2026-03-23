import db from "./config/database.js";

db.serialize(() => {
  db.run("DROP TABLE IF EXISTS bidding", (err) => {
    if (err) {
      console.error("Error dropping bidding table:", err.message);
    } else {
      console.log("Dropped bidding table (if existed)");
    }
  });

  db.run("DROP TABLE IF EXISTS bidhistory", (err) => {
    if (err) {
      console.error("Error dropping bidhistory table:", err.message);
    } else {
      console.log("Dropped bidhistory table (if existed)");
    }
  });
});

db.close((err) => {
  if (err) {
    console.error("Error closing database:", err.message);
  } else {
    console.log("Database connection closed.");
  }
});