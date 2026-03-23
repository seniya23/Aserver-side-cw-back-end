import express from "express";
import { clearBids, deleteBids, placeBidding, selectWinner, updateBid, viewBiddingAlumni } from "../controllers/biddingsystemController.js";

const biddingRouter = express.Router();

biddingRouter.post("/", placeBidding)
biddingRouter.get("/", viewBiddingAlumni)
biddingRouter.get("/:email", deleteBids)
biddingRouter.delete("/clear", clearBids);
biddingRouter.put("/",updateBid);
biddingRouter.post("/winner",selectWinner);

export default biddingRouter