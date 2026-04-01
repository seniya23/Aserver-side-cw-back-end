import express from "express";
import { Createalumniprofile, Getalumniprofile, Updatealumniprofile } from "../controllers/alumniprofileController.js";

const alumniRouter = express.Router();

/**
 * @swagger
 * /api/alumni:
 *   post:
 *     summary: Create a new alumni profile
 *     tags: [Alumni]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *               - degree
 *               - employmentStartDate
 *               - shortCourse
 *               - professionalLicences
 *               - linkedinUrl
 *               - bio
 *             properties:
 *               image:
 *                 type: string
 *                 description: image of alumni
 *               degree:
 *                 type: string
 *                 description: Year of graduation
 *               employmentStartDate:
 *                 type: string
 *                 description: Current job start date
 *               shortCourse:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: other completed courses
 *               professionalLicences:
 *                 type: string
 *                 description: prof license
 *               linkedinUrl:
 *                 type: string
 *                 description: Array of skills
 *               bio:
 *                 type: string
 *                 description: Professional bio
 *     responses:
 *       201:
 *         description: Alumni profile created successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Alumni profile created successfully"
 *       409:
 *         description: User already has a profile
 *       401:
 *         description: Please Login
 *       500:
 *         description: Database error
 */
alumniRouter.post("/", Createalumniprofile)

/**
 * @swagger
 * /api/alumni/{email}:
 *   get:
 *     summary: Get alumni profile by email
 *     tags: [Alumni]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *           format: email
 *         description: Email address of the alumni
 *     responses:
 *       200:
 *         description: Alumni profile retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               email: "alumni@example.com"
 *               firstName: "firstname"
 *               lastName: "lastname"
 *               degree: "degree"
 *               employmentStartDate: "2025.1.25"
 *               employmentEndDate: "null"
 *               shortCourses: ["JavaScript", "React", "Node.js"]
 *               professionalLicences: "professionalLicences"
 *               professionalCertifications: "null"
 *               linkedinUrl: "linkedinUrl"
 *               bio: "Experienced software engineer..."
 *               bidWins: 1
 *               profileCompletionPercentage: 62
 *       401:
 *         description: User not found
 *       404:
 *         description: User not found
 *       500:
 *         description: Database error
 */
alumniRouter.get("/:email", Getalumniprofile)

/**
 * @swagger
 * /api/alumni/{email}:
 *   put:
 *     summary: Update alumni profile
 *     tags: [Alumni]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *           format: email
 *         description: Email address of the alumni
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               employmentEndDate:
 *                 type: string
 *               bio:
 *                 type: string
 *     responses:
 *       200:
 *         description: Alumni profile updated successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Alumni profile updated successfully"
 *       401:
 *         description: Please login
 *       404:
 *         description: Alumni profile not found
 *       500:
 *         description: Database error
 *       403:
 *         description: Forbidden
 */
alumniRouter.put("/:email", Updatealumniprofile)

export default alumniRouter