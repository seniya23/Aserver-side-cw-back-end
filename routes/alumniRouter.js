import express from "express";
import { Createalumniprofile, Getalumniprofile, Updatealumniprofile } from "../controllers/alumniprofileController.js";
import { viewbidWinner } from "../controllers/biddingsystemController.js";
import { authenticateApiKey, requirePermission } from "../middlewares/apiKeyAuth.js";
import { createAlumniPost, getHomeFeedPosts, getPostsByAlumniEmail } from "../controllers/alumniPostController.js";

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
 * /api/alumni/of-the-day:
 *   get:
 *     summary: Get alumni of the day (current bid winner) - Mobile AR App
 *     tags: [Alumni]
 *     security:
 *       - apiKey: []
 *     responses:
 *       200:
 *         description: Current alumni of the day (bid winner)
 *         content:
 *           application/json:
 *             example:
 *               message: {
 *                 id: 1,
 *                 email: "alumni@example.com",
 *                 firstName: "John",
 *                 lastName: "Doe",
 *                 bidWins: 5,
 *                 image: "profile.jpg"
 *               }
 *       400:
 *         description: No active winner
 *       403:
 *         description: Insufficient permissions (requires read:alumni_of_day)
 *       500:
 *         description: Database error
 */
alumniRouter.get("/of-the-day", authenticateApiKey, requirePermission("read:alumni_of_day"), viewbidWinner)

/**
 * @swagger
 * /api/alumni/posts:
 *   post:
 *     summary: Create an alumni post
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
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 description: Post content
 *     responses:
 *       201:
 *         description: Post created successfully
 *       401:
 *         description: Please login
 *       403:
 *         description: Only alumni can create posts
 */
alumniRouter.post("/posts", createAlumniPost)

/**
 * @swagger
 * /api/alumni/posts:
 *   get:
 *     summary: Get all alumni posts for home page feed
 *     tags: [Alumni]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Feed posts fetched successfully
 *       401:
 *         description: Please login
 */
alumniRouter.get("/posts", getHomeFeedPosts)

/**
 * @swagger
 * /api/alumni/{email}/posts:
 *   get:
 *     summary: Get posts by a specific alumni
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
 *         description: Alumni email
 *     responses:
 *       200:
 *         description: Alumni posts fetched successfully
 *       404:
 *         description: Alumni not found
 */
alumniRouter.get("/:email/posts", getPostsByAlumniEmail)

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