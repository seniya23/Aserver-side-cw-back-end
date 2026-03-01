import express from "express";
import { Createuser, Isblocked, Loginuser, Otpverify_Passwordreset, Sendotp, Userdelete } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/", Createuser)
userRouter.post("/login",Loginuser)
userRouter.put("/isblocked/:email",Isblocked)
userRouter.get("/send-otp/:email", Sendotp)
userRouter.post("/verify-otp", Otpverify_Passwordreset)
userRouter.get("/user-delete/:email", Userdelete)

export default userRouter