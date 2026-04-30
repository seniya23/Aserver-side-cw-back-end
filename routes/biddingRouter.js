import express from "express";
import { clearBids, deleteBids, placeBidding, selectWinner, updateBid, viewBiddingAlumni, viewbidWinner, adminGetAllBids, adminGetActiveBids, adminGetWinners, adminGetStats } from "../controllers/biddingsystemController.js";
import { authenticateApiKey, requirePermission } from "../middlewares/apiKeyAuth.js";

const biddingRouter = express.Router();

/**
 * @swagger
 * /api/bidding:
 *   post:
 *     summary: Place a bid from an alumni profile
 *     tags: [Bidding]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bidAmount
 *             properties:
 *               bidAmount:
 *                 type: number
 *                 minimum: 0
 *                 description: Bid amount in currency units
 *     responses:
 *       201:
 *         description: Bid placed successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Bid placed successfully"
 *               bidId: 123
 *       400:
 *         description: Invalid bid amount or You have an active bid
 *         content:
 *           application/json:
 *             example:
 *               message: "Invalid bid amount"
 *       401:
 *         description: Please Login as Alumni
 *       404:
 *         description: Alumni profile not found
 *       500:
 *         description: Database error
 */
biddingRouter.post("/", placeBidding)

/**
 * @swagger
 * /api/bidding:
 *   get:
 *     summary: View bidding history and current bid status of the alumni profile
 *     tags: [Bidding]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current bid status, monthly wins, remaining slots, and bid history
 *         content:
 *           application/json:
 *             example:
 *               currentBid: null
 *               monthlyWins: 2
 *               remainingSlots: 1
 *               bidHistory: [{
 *                 id: 10,
 *                 email: "alumni@example.com",
 *                 firstName: "firstname",
 *                 lastName: "lastname",
 *                 bidAmount: 800,
 *                 bidDate: "2026-03-18 12:17:00",
 *                 action: "won"
 *               }]
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Failed to fetch bidding data
 */
biddingRouter.get("/", viewBiddingAlumni)

/**
 * @swagger
 * /api/bidding/{email}:
 *   get:
 *     summary: Delete current bid of a specific alumni
 *     tags: [Bidding]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *           format: email
 *         description: Email of the alumni whose bids to delete
 *     responses:
 *       200:
 *         description: Bids deleted successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Bids deleted successfully"
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Database error
 *       404:
 *         description: User not Exist
 */
biddingRouter.get("/:email", deleteBids)

/**
 * @swagger
 * /api/bidding/clear:
 *   delete:
 *     summary: Clear bidding and bidhistory tables
 *     tags: [Bidding]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All bids cleared successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "All bids cleared successfully"
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Delete bidhistory failed
 */
biddingRouter.delete("/clear", clearBids);

/**
 * @swagger
 * /api/bidding:
 *   put:
 *     summary: Update an existing bid
 *     tags: [Bidding]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bidAmount
 *             properties:
 *               bidAmount:
 *                 type: number
 *                 minimum: 0
 *                 description: New bid amount
 *     responses:
 *       200:
 *         description: Bid updated successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Bid updated successfully"
 *       400:
 *         description: Invalid bid amount 
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Database error
 */
biddingRouter.put("/",updateBid);

/**
 * @swagger
 * /api/bidding/winner:
 *   post:
 *     summary: Select winners for completed bidding rounds
 *     tags: [Bidding]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *     responses:
 *       200:
 *         description: Winner selected successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Winner selected: winner@example.com with bid $500"
 *       
 */
biddingRouter.post("/winner",selectWinner);

/**
 * @swagger
 * /api/bidding/viewwinner:
 *   post:
 *     summary: View the current bid winner and their alumni profile
 *     tags: [Bidding]
 *     security: []  # No authentication required
 *     responses:
 *       200:
 *         description: Winner alumni profile
 *         content:
 *           application/json:
 *             example:
 *               message: {
 *                 id: 1,
 *                 email: "winner@example.com",
 *                 firstName: "fistname",
 *                 lastName: "lastname",
 *                 bidWins: 2
 *               }
 * 
 *       400:
 *         description: No active winner or data fetching error
 *         content:
 *           application/json:
 *             example:
 *               message: "No active winner"
 */
biddingRouter.post("/viewwinner",viewbidWinner);

// Admin routes for bidding management with API key authentication
/**
 * @swagger
 * /api/bidding/admin/all-bids:
 *   get:
 *     summary: Get all bids (Admin - API Key required)
 *     tags: [Bidding Admin]
 *     security:
 *       - apiKey: []
 *     responses:
 *       200:
 *         description: Array of all bids
 *       403:
 *         description: Insufficient permissions
 */
biddingRouter.get("/admin/all-bids", authenticateApiKey, requirePermission("read:bidding"), adminGetAllBids);

/**
 * @swagger
 * /api/bidding/admin/active-bids:
 *   get:
 *     summary: Get active bids (Admin - API Key required)
 *     tags: [Bidding Admin]
 *     security:
 *       - apiKey: []
 *     responses:
 *       200:
 *         description: Array of active bids
 *       403:
 *         description: Insufficient permissions
 */
biddingRouter.get("/admin/active-bids", authenticateApiKey, requirePermission("read:bidding"), adminGetActiveBids);

/**
 * @swagger
 * /api/bidding/admin/winners:
 *   get:
 *     summary: Get winning bids (Admin - API Key required)
 *     tags: [Bidding Admin]
 *     security:
 *       - apiKey: []
 *     responses:
 *       200:
 *         description: Array of winning bids
 *       403:
 *         description: Insufficient permissions
 */
biddingRouter.get("/admin/winners", authenticateApiKey, requirePermission("read:bidding"), adminGetWinners);

/**
 * @swagger
 * /api/bidding/admin/stats:
 *   get:
 *     summary: Get bidding statistics (Admin - API Key required)
 *     tags: [Bidding Admin]
 *     security:
 *       - apiKey: []
 *     responses:
 *       200:
 *         description: Bidding statistics
 *       403:
 *         description: Insufficient permissions
 */
biddingRouter.get("/admin/stats", authenticateApiKey, requirePermission("read:bidding"), adminGetStats);

export default biddingRouter