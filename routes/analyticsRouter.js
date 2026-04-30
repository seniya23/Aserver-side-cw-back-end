import express from "express";
import { authenticateApiKey, requirePermission } from "../middlewares/apiKeyAuth.js";
import {
    getIndustryData,
    getGraduationYearData,
    getCertificationsData,
    getBidWinsData,
    getDegreesData,
    getEmploymentStartDateData,
    getEmploymentDurationData
} from "../controllers/analyticsController.js";

const analyticsRouter = express.Router();

analyticsRouter.use(authenticateApiKey);

/**
 * @swagger
 * /api/analytics/industry:
 *   get:
 *     summary: Get alumni data grouped by industry
 *     tags: [Analytics]
 *     security:
 *       - apiKey: []
 *     responses:
 *       200:
 *         description: Industry distribution data
 *       403:
 *         description: Insufficient permissions
 *       500:
 *         description: Database error
 */
analyticsRouter.get("/industry", requirePermission("read:analytics"), getIndustryData);

/**
 * @swagger
 * /api/analytics/graduation-year:
 *   get:
 *     summary: Get alumni data grouped by graduation year
 *     tags: [Analytics]
 *     security:
 *       - apiKey: []
 *     responses:
 *       200:
 *         description: Graduation year distribution data
 *       403:
 *         description: Insufficient permissions
 *       500:
 *         description: Database error
 */
analyticsRouter.get("/graduation-year", requirePermission("read:analytics"), getGraduationYearData);

/**
 * @swagger
 * /api/analytics/certifications:
 *   get:
 *     summary: Get alumni certifications data
 *     tags: [Analytics]
 *     security:
 *       - apiKey: []
 *     responses:
 *       200:
 *         description: Certifications distribution data
 *       403:
 *         description: Insufficient permissions
 *       500:
 *         description: Database error
 */
analyticsRouter.get("/certifications", requirePermission("read:analytics"), getCertificationsData);

/**
 * @swagger
 * /api/analytics/bid-wins:
 *   get:
 *     summary: Get alumni data grouped by bid wins
 *     tags: [Analytics]
 *     security:
 *       - apiKey: []
 *     responses:
 *       200:
 *         description: Bid wins distribution data
 *       403:
 *         description: Insufficient permissions
 *       500:
 *         description: Database error
 */
analyticsRouter.get("/bid-wins", requirePermission("read:analytics"), getBidWinsData);

/**
 * @swagger
 * /api/analytics/degrees:
 *   get:
 *     summary: Get alumni degrees data
 *     tags: [Analytics]
 *     security:
 *       - apiKey: []
 *     responses:
 *       200:
 *         description: Degrees distribution data
 *       403:
 *         description: Insufficient permissions
 *       500:
 *         description: Database error
 */
analyticsRouter.get("/degrees", requirePermission("read:analytics"), getDegreesData);

/**
 * @swagger
 * /api/analytics/employment-start-date:
 *   get:
 *     summary: Get alumni data grouped by employment start date
 *     tags: [Analytics]
 *     security:
 *       - apiKey: []
 *     responses:
 *       200:
 *         description: Employment start date distribution data
 *       403:
 *         description: Insufficient permissions
 *       500:
 *         description: Database error
 */
analyticsRouter.get("/employment-start-date", requirePermission("read:analytics"), getEmploymentStartDateData);

/**
 * @swagger
 * /api/analytics/employment-duration:
 *   get:
 *     summary: Get employment duration data
 *     tags: [Analytics]
 *     security:
 *       - apiKey: []
 *     responses:
 *       200:
 *         description: Employment duration data
 *       403:
 *         description: Insufficient permissions
 *       500:
 *         description: Database error
 */
analyticsRouter.get("/employment-duration", requirePermission("read:analytics"), getEmploymentDurationData);

export default analyticsRouter;