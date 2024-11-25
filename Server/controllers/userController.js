import userModel from "../models/userModel.js";
import transactionModel from "../models/transactionModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import razorpay from "razorpay";

const registerUser = async (req, res) => {

    try{
        const {name, email, password} = req.body;

        if(!name || !email || !password){
            return res.status(400).json({
                success: false,
                message: "Please enter all fields"
            });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const userData={
            name,
            email,
            password: hashedPassword
        }

        const newUser = new userModel(userData);
        const user = await newUser.save();

        const token = jwt.sign({
            id: user._id}, 
            process.env.JWT_SECRET)

        res.json({ success: true, token, user:{name: user.name}});
            

    }
    catch(error){
        console.log(error);
        res.json({success: false, message: "Something went wrong"});
    }
}

const loginUser = async (req, res) => {

    try{
        const {email, password} = req.body;

        if(!email || !password){
            return res.status(400).json({
                success: false,
                message: "Please enter all fields"
            });
        }

        const user = await userModel.findOne({email});

        if(!user){
            return res.status(400).json({
                success: false,
                message: "User not found"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
            return res.status(400).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        const token = jwt.sign({
            id: user._id}, 
            process.env.JWT_SECRET)

        res.json({ success: true, token, user:{name: user.name}});

    }
    catch(error){
        console.log(error);
        res.json({success: false, message: "Something went wrong"});
    }
}

const  userCredits = async (req, res) => {

    try{

        const {userId} = req.body;

        const user = await userModel.findById(userId);
        res.json({success: true, credits: user.creditBalance, user:{name: user.name}});

    }
    catch(error){
        console.log(error);
        res.json({success: false, message: "Something went wrong"});
    }
}

const razorpayInstance = new razorpay({
    key_id: process.env.RAZORPAY_API_KEY,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

const paymentRazorpay = async (req, res) => {

    try{

        const {userId, planId} = req.body;

        const userData = await userModel.findById(userId);

        if(!userData || !planId){
            return res.status(400).json({
                success: false,
                message: "Please enter all fields"
            });
        }

        let credits,plan,amount,date

        switch(planId){
            case "Basic":
                credits = 100;
                plan = "Basic";
                amount = 10;
                date = new Date();
                break;
            case "Advanced":
                credits = 500;
                plan = "Advanced";
                amount = 50;
                date = new Date();
                break;
            case "Business":
                credits = 5000;
                plan = "Business";
                amount = 250;
                date = new Date();
                break;
            default:
                return res.status(400).json({
                    success: false,
                    message: "Invalid plan"
                });
        }
        date =Date.now() 
               

        const transactionData ={
            userId,
            plan,
            amount,
            credits,
            date
        }

        const newTransaction =  await transactionModel.create(transactionData);

        const options = {
            amount: amount * 100,
            currency: "SGD",
            receipt: newTransaction._id
        }
        razorpayInstance.orders.create(options, (error, order) => {
            if (error) {
                console.log(error);
                res.json({ success: false, message: "Something went wrong" });
            }
            res.json({ success: true, order });
        })
    }
    catch(error){
        console.log(error);
        res.json({success: false, message: "Something went wrong"});
    }
}

const verifyRazorpay = async (req, res) => {

    try{

        const {razorpay_order_id} = req.body;
        
        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);

        if(orderInfo.status === "created"){
            const transactionData = await transactionModel.findById(orderInfo.receipt);
            if(transactionData.payment){
                return res.json({success: false, message: "Payment Failed"});
            }
            const userData = await userModel.findById(transactionData.userId);

            const creditsBalance = userData.creditBalance + transactionData.credits;
            await userModel.updateOne(userData._id , { creditsBalance});
             
            await transactionModel.findByIdAndUpdate(transactionData._id, {payment: true});

            return res.json({success: true, message: "Payment Successful"});


        }
        else{
            return res.json({success: false, message: "Payment Failed"});
        }

    }
    catch(error){
        console.log(error);
        res.json({success: false, message: "Something went wrong"});
    }
}


export {registerUser, loginUser, userCredits, paymentRazorpay, verifyRazorpay};