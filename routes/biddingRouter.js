import express from "express";
import { clearBids, deleteBids, placeBidding, selectWinner, updateBid, viewBiddingAlumni } from "../controllers/biddingsystemController.js";

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
 *         description: Database error
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
 *               - bidId
 *               - newAmount
 *             properties:
 *               bidId:
 *                 type: integer
 *                 description: ID of the bid to update
 *               newAmount:
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
 *         description: Invalid bid amount or bidding period ended
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Bid not found
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
 *           schema:
 *             type: object
 *             required:
 *               - alumniEmail
 *             properties:
 *               alumniEmail:
 *                 type: string
 *                 format: email
 *                 description: Email of the alumni whose bidding round to close
 *     responses:
 *       200:
 *         description: Winner selected successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Winner selected and notified"
 *               winner: {
 *                 bidderEmail: "winner@example.com",
 *                 bidAmount: 1000
 *               }
 *       400:
 *         description: No bids found or bidding still active
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Database error or email sending failed
 */
biddingRouter.post("/winner",selectWinner);

export default biddingRouter