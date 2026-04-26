import express from "express";
import { Createuser, getAllUsers, googleLogin, Loginuser, Otpverify_Passwordreset, Sendotp, updateUserStatus, Userdelete, createApiKey, getAllApiKeys, updateApiKeyStatus, deleteApiKey } from "../controllers/userController.js";

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

userRouter.post("/google-login", googleLogin)

userRouter.get("/all", getAllUsers)

userRouter.put("/toggle-block/:email", updateUserStatus)

userRouter.post("/create-api-key", createApiKey)

userRouter.get("/api-keys", getAllApiKeys)

userRouter.put("/api-keys/:id/status", updateApiKeyStatus)

userRouter.delete("/api-keys/:id", deleteApiKey)



export default userRouter