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
 *               - email
 *               - name
 *               - graduationYear
 *               - currentPosition
 *               - company
 *               - location
 *               - skills
 *               - bio
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Alumni's email address
 *               name:
 *                 type: string
 *                 description: Full name
 *               graduationYear:
 *                 type: integer
 *                 description: Year of graduation
 *               currentPosition:
 *                 type: string
 *                 description: Current job position
 *               company:
 *                 type: string
 *                 description: Current company
 *               location:
 *                 type: string
 *                 description: Current location
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
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
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
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
 *               name: "John Doe"
 *               graduationYear: 2020
 *               currentPosition: "Software Engineer"
 *               company: "Tech Corp"
 *               location: "London"
 *               skills: ["JavaScript", "React", "Node.js"]
 *               bio: "Experienced software engineer..."
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Alumni profile not found
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
 *               name:
 *                 type: string
 *               graduationYear:
 *                 type: integer
 *               currentPosition:
 *                 type: string
 *               company:
 *                 type: string
 *               location:
 *                 type: string
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
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
 *         description: Unauthorized
 *       404:
 *         description: Alumni profile not found
 *       500:
 *         description: Database error
 */
alumniRouter.put("/:email", Updatealumniprofile)

export default alumniRouter