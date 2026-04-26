import db from "../config/database.js";

db.run(`
  CREATE TABLE IF NOT EXISTS alumni (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    firstName TEXT NOT NULL,
    lastName TEXT NOT NULL,
    image TEXT DEFAULT 'default.jpg',
    employmentStartDate TEXT,
    employmentEndDate TEXT,
    shortCourses TEXT,
    professionalLicences TEXT,
    professionalCertifications TEXT,
    degrees TEXT,
    linkedinUrl TEXT,
    biography TEXT,
    bidWins INTEGER DEFAULT 0,
    profileCompletionPercentage INTEGER DEFAULT 0,
    industry TEXT,
    graduationYear INTEGER    
  )
`);

export default db;