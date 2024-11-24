import jwt from "jsonwebtoken";


const userAuth = async (req, res, next) => {
    try {
        
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decodedToken;
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({ success: false, message: "Unauthorized" });
    }
};

export default userAuth;