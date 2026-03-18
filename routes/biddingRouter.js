import express from "express";
import { clearBids, deleteBids, placeBidding, viewBiddingAlumni } from "../controllers/biddingsystemController.js";

const biddingRouter = express.Router();

biddingRouter.post("/", placeBidding)
biddingRouter.get("/", viewBiddingAlumni)
biddingRouter.get("/:email", deleteBids)
biddingRouter.delete("/clear", clearBids);

export default biddingRouter