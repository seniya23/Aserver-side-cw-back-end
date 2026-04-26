import apiKeyTable from "../models/apiKeyTable.js";

export function authenticateApiKey(req, res, next) {
    const apiKeyHeader = process.env.API_KEY_HEADER;
    const apiKey = req.header(apiKeyHeader);

    if (!apiKey) {
        return res.status(401).json({ message: "API key required" });
    }

    apiKeyTable.get("SELECT * FROM api_keys WHERE key = ? AND is_active = 1", [apiKey], (err, keyRecord) => {
        if (err) {
            return res.status(500).json({ message: "Database error" });
        }
        if (!keyRecord) {
            return res.status(401).json({ message: "Invalid API key" });
        }

        try {
            req.apiPermissions = JSON.parse(keyRecord.permissions);
        } catch (e) {
            return res.status(500).json({ message: "Invalid permissions format" });
        }

        next();
    });
}

export function requirePermission(permission) {
    return (req, res, next) => {
        if (!req.apiPermissions || !req.apiPermissions.includes(permission)) {
            return res.status(403).json({ message: "Insufficient permissions" });
        }
        next();
    };
}