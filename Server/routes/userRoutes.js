import express from "express";
import { registerUser, loginUser, userCredits, paymentRazorpay, verifyRazorpay } from "../controllers/userController.js";
import userAuth from "../middlewares/auth.js";


const userRouter = express.Router();

userRouter.post("/register", registerUser); 
userRouter.post("/login", loginUser);
userRouter.get("/credits",userAuth, userCredits);
userRouter.post("/payment",userAuth, paymentRazorpay);
userRouter.post("/verify-payment",userAuth,verifyRazorpay );

export default userRouter;

//http://localhost:4000/api/user/register
//http://localhost:4000/api/user/login
//http://localhost:4000/api/user/credits