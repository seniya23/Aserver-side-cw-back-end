import express from "express";
import { placeBidding, viewBiddingAlumni } from "../controllers/biddingsystemController.js";

const biddingRouter = express.Router();

biddingRouter.post("/", placeBidding)
biddingRouter.get("/", viewBiddingAlumni)

export default biddingRouter