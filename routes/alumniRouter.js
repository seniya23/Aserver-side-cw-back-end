import express from "express";
import { Createalumniprofile, Getalumniprofile, Updatealumniprofile } from "../controllers/alumniprofileController.js";

const alumniRouter = express.Router();

alumniRouter.post("/", Createalumniprofile)
alumniRouter.get("/:email", Getalumniprofile)
alumniRouter.put("/:email", Updatealumniprofile) // full update
// or use patch: alumniRouter.patch("/:email", Updatealumniprofile)

export default alumniRouter