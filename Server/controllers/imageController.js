import axios from "axios";
import userModel from "../models/userModel.js";
import FormData from "form-data";

export const generateImage = async (req, res) => {
    try {
        const { userId, prompt } = req.body;

        // Input validation
        if (!userId || !prompt) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields: userId and prompt are required"
            });
        }

        // Find user and handle potential errors
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Check credit balance
        const REQUIRED_CREDITS = 1;
        if (user.creditBalance < REQUIRED_CREDITS) {
            return res.status(403).json({
                success: false,
                message: "Insufficient credits",
                creditBalance: user.creditBalance
            });
        }

        // Prepare and send request to ClipDrop API
        const formData = new FormData();
        formData.append("prompt", prompt);

        const response = await axios.post('https://clipdrop-api.co/text-to-image/v1', formData, {
            headers: {
                'x-api-key': process.env.CLIPDROP_API,
            },
            responseType: 'arraybuffer',
            validateStatus: status => status < 500 // Handle API errors gracefully
        });

        // Convert image to base64
        const base64Image = Buffer.from(response.data, 'binary').toString('base64');
        const resultImage = `data:image/png;base64,${base64Image}`;

        // Update user credits - using atomic operation
        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            { $inc: { creditBalance: -REQUIRED_CREDITS } },
            { new: true }
        );

        if (!updatedUser) {
            throw new Error("Failed to update user credits");
        }

        return res.status(200).json({
            success: true,
            message: "Image generated successfully",
            creditBalance: updatedUser.creditBalance,
            image: resultImage
        });

    } catch (error) {
        console.error("Image generation error:", error.message || error);
        
        // Determine if it's a client error or server error
        const statusCode = error.response?.status || 500;
        
        return res.status(statusCode).json({
            success: false,
            message: statusCode < 500 ? error.message : "Internal server error occurred"
        });
    }
};