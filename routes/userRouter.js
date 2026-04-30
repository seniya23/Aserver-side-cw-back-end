import express from "express";
import { Createuser, getAllUsers, googleLogin, Loginuser, Otpverify_Passwordreset, Sendotp, updateUserStatus, Userdelete, createApiKey, getAllApiKeys, updateApiKeyStatus, deleteApiKey } from "../controllers/userController.js";
import { getCertificationsData, getDegreesData, getIndustryData } from "../controllers/analyticsController.js";

const userRouter = express.Router();

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user account
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - firstName
 *               - lastName
 *               - password   
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's university email address
 *               firstName:
 *                 type: string
 *                 description: User's first name
 *               lastName:
 *                 type: string
 *                 description: User's last name
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 description: User's password
 *               
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "User created successfully"
 *       400:
 *         description: Invalid email domain or validation error
 *         content:
 *           application/json:
 *             example:
 *               message: "Only university email allowed"
 *       404:
 *         description: User already exists
 *         content:
 *           application/json:
 *             example:
 *               message: "User already exists"
 *       500:
 *         description: Database error
 *         content:
 *           application/json:
 *             example:
 *               message: "Database error"
 */
userRouter.post("/", Createuser)

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Authenticate user login
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             example:
 *               role : "user.role"
 *               massage : "Successfully login welcome back"
 *               token: "jwt_token_here"
 *               
 *                           
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             example:
 *               message: "Please check password or email"
 *       403:
 *         description: Account is blocked
 *         content:
 *           application/json:
 *             example:
 *               message: "User is block please contact admin"
 */
userRouter.post("/login",Loginuser)

// /**
//  * @swagger
//  * /api/users/isblocked/{email}:
//  *   put:
//  *     summary: Block or unblock a user account
//  *     tags: [Users]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: email
//  *         required: true
//  *         schema:
//  *           type: string
//  *           format: email
//  *         description: Email of the user to block/unblock
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             required:
//  *               - isBlocked
//  *             properties:
//  *               isBlocked:
//  *                 type: integer
//  *                 description: Block status (1 to block, 0 to unblock)
//  *     responses:
//  *       200:
//  *         description: User status updated successfully
//  *         content:
//  *           application/json:
//  *             example:
//  *               message: "User blocked successfully"
//  *       401:
//  *         description: Unauthorized
//  *       500:
//  *         description: Couldn't update status
//  */
// userRouter.put("/isblocked/:email",Isblocked)

/**
 * @swagger
 * /api/users/send-otp/{email}:
 *   get:
 *     summary: Send OTP for password reset
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *           format: email
 *         description: Email address to send OTP
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "OTP sent successfully"
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             example:
 *               message: "User not found"
 *       500:
 *         description: Database error
 */
userRouter.get("/send-otp/:email", Sendotp)

/**
 * @swagger
 * /api/users/verify-otp:
 *   post:
 *     summary: Verify OTP and reset password
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *               - newpassword
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               otp:
 *                 type: string
 *                 description: 6-digit OTP code
 *               newPassword:
 *                 type: string
 *                 minLength: 6
 *     responses:
 *       200:
 *         description: Password reset successful
 *         content:
 *           application/json:
 *             example:
 *               message: "Password reset successfully"
 *       400:
 *         description: Invalid OTP or expired
 *         content:
 *           application/json:
 *             example:
 *               message: "Invalid or expired OTP"
 *       500:
 *         description: Database error
 */
userRouter.post("/verify-otp", Otpverify_Passwordreset)

/**
 * @swagger
 * /api/users/user-delete/{email}:
 *   get:
 *     summary: Delete a user account
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *           format: email
 *         description: Email of the user to delete
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "User deleted successfully"
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Database error
 *       403:
 *         description: Forbidden - admin access required
 */
userRouter.get("/user-delete/:email", Userdelete)

/**
 * @swagger
 * /api/users/google-login:
 *   post:
 *     summary: Login or register user with Google OAuth token
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *             properties:
 *               token:
 *                 type: string
 *                 description: Google access token from client app
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             example:
 *               message: "Login successful"
 *               token: "jwt_token_here"
 *               role: "alumni"
 *       403:
 *         description: User is blocked
 *       500:
 *         description: Google login failed or database error
 */
userRouter.post("/google-login", googleLogin)

/**
 * @swagger
 * /api/users/all:
 *   get:
 *     summary: Get all users (admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Error fetching users
 */
userRouter.get("/all", getAllUsers)

/**
 * @swagger
 * /api/users/toggle-block/{email}:
 *   put:
 *     summary: Block or unblock a user (admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *           format: email
 *         description: Email of the user to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - isBlocked
 *             properties:
 *               isBlocked:
 *                 type: integer
 *                 enum: [0, 1]
 *                 description: 1 to block, 0 to unblock
 *     responses:
 *       200:
 *         description: User status updated successfully
 *       400:
 *         description: Invalid input or admin self-block attempt
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - admin access required
 *       500:
 *         description: Error updating user status
 */
userRouter.put("/toggle-block/:email", updateUserStatus)

/**
 * @swagger
 * /api/users/create-api-key:
 *   post:
 *     summary: Create API key for external client (admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - clientName
 *               - permissions
 *             properties:
 *               clientName:
 *                 type: string
 *               permissions:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["read:alumni_of_day"]
 *     responses:
 *       200:
 *         description: API key created
 *       400:
 *         description: clientName and permissions array required
 *       403:
 *         description: Admin access required
 *       500:
 *         description: Failed to create API key
 */
userRouter.post("/create-api-key", createApiKey)

/**
 * @swagger
 * /api/users/api-keys:
 *   get:
 *     summary: Get all API keys (admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: API keys list
 *       403:
 *         description: Admin access required
 *       500:
 *         description: Failed to fetch API keys
 */
userRouter.get("/api-keys", getAllApiKeys)

/**
 * @swagger
 * /api/users/api-keys/{id}/status:
 *   put:
 *     summary: Activate or revoke an API key (admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: API key ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - isActive
 *             properties:
 *               isActive:
 *                 type: integer
 *                 enum: [0, 1]
 *                 description: 1 to activate, 0 to revoke
 *     responses:
 *       200:
 *         description: API key status updated successfully
 *       400:
 *         description: isActive must be 0 or 1
 *       403:
 *         description: Admin access required
 *       500:
 *         description: Failed to update API key status
 */
userRouter.put("/api-keys/:id/status", updateApiKeyStatus)

/**
 * @swagger
 * /api/users/api-keys/{id}:
 *   delete:
 *     summary: Delete an API key (admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: API key ID
 *     responses:
 *       200:
 *         description: API key deleted successfully
 *       403:
 *         description: Admin access required
 *       500:
 *         description: Failed to delete API key
 */
userRouter.delete("/api-keys/:id", deleteApiKey)

/**
 * @swagger
 * /api/users/certifications:
 *   get:
 *     summary: Get list of professional certifications from alumni profiles
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Certifications fetched successfully
 *       500:
 *         description: Database error
 */
userRouter.get("/certifications", getCertificationsData)

/**
 * @swagger
 * /api/users/industry:
 *   get:
 *     summary: Get list of industries from alumni profiles
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Industry data fetched successfully
 *       500:
 *         description: Database error
 */
userRouter.get("/industry", getIndustryData)

/**
 * @swagger
 * /api/users/degrees:
 *   get:
 *     summary: Get list of degrees from alumni profiles
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Degrees data fetched successfully
 *       500:
 *         description: Database error
 */
userRouter.get("/degrees", getDegreesData)



export default userRouter