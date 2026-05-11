import alumniTable from "../models/alumniTable.js";

// Helper function 
function getGroupedData(field, callback) {
    alumniTable.all(`SELECT ${field}, COUNT(*) as count FROM alumni WHERE ${field} IS NOT NULL GROUP BY ${field}`, (err, rows) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, rows);
        }
    });
}

export function getIndustryData(req, res) {
    getGroupedData('industry', (err, data) => {
        if (err) {
            return res.status(500).json({ message: "Database error" });
        }
        res.json(data);
    });
}

export function getGraduationYearData(req, res) {
    getGroupedData('graduationYear', (err, data) => {
        if (err) {
            return res.status(500).json({ message: "Database error" });
        }
        res.json(data);
    });
}

export function getCertificationsData(req, res) {
    
    alumniTable.all("SELECT professionalCertifications FROM alumni WHERE professionalCertifications IS NOT NULL", (err, rows) => {
        if (err) {
            return res.status(500).json({ message: "Database error" });
        }
        const certCount = {};
        rows.forEach(row => {
            if (row.professionalCertifications) {
                const certs = row.professionalCertifications.split(',');
                certs.forEach(cert => {
                    cert = cert.trim();
                    certCount[cert] = (certCount[cert] || 0) + 1;
                });
            }
        });
        const data = Object.keys(certCount).map(cert => ({ certification: cert, count: certCount[cert] }));
        res.json(data);
    });
}

export function getBidWinsData(req, res) {
    getGroupedData('bidWins', (err, data) => {
        if (err) {
            return res.status(500).json({ message: "Database error" });
        }
        res.json(data);
    });
}

export function getDegreesData(req, res) {
    
    alumniTable.all("SELECT degrees FROM alumni WHERE degrees IS NOT NULL", (err, rows) => {
        if (err) {
            return res.status(500).json({ message: "Database error" });
        }
        const degreeCount = {};
        rows.forEach(row => {
            if (row.degrees) {
                const degrees = row.degrees.split(',');
                degrees.forEach(degree => {
                    degree = degree.trim();
                    degreeCount[degree] = (degreeCount[degree] || 0) + 1;
                });
            }
        });
        const data = Object.keys(degreeCount).map(degree => ({ degree: degree, count: degreeCount[degree] }));
        res.json(data);
    });
}

export function getEmploymentStartDateData(req, res) {
    getGroupedData('employmentStartDate', (err, data) => {
        if (err) {
            return res.status(500).json({ message: "Database error" });
        }
        res.json(data);
    });
}

export function getEmploymentDurationData(req, res) {
    alumniTable.all(
        "SELECT employmentStartDate, employmentEndDate FROM alumni WHERE employmentStartDate IS NOT NULL AND employmentEndDate IS NOT NULL",
        (err, rows) => {
            if (err) {
                return res.status(500).json({ message: "Database error" });
            }
            const durations = rows.map(row => {
                const startDate = new Date(row.employmentStartDate);
                const endDate = new Date(row.employmentEndDate);
                const durationInDays = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24));
                const durationInMonths = Math.floor(durationInDays / 30);
                return {
                    startDate: row.employmentStartDate,
                    endDate: row.employmentEndDate,
                    durationInDays: durationInDays,
                    durationInMonths: durationInMonths
                };
            });
            res.json(durations);
        }
    );
}

