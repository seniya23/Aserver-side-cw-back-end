import express from "express";
import { deleteBids, placeBidding, viewBiddingAlumni } from "../controllers/biddingsystemController.js";

const biddingRouter = express.Router();

biddingRouter.post("/", placeBidding)
biddingRouter.get("/", viewBiddingAlumni)
biddingRouter.get("/:email", deleteBids)

export default biddingRouter