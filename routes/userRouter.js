import express from "express";
import { Createuser, Isblocked, Loginuser } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/", Createuser)
userRouter.post("/login",Loginuser)
userRouter.put("/isblocked/:email",Isblocked)

export default userRouter