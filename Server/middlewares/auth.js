import e from "express";
import jwt from "jsonwebtoken";


const userAuth = async (req, res, next) => {

        const{token} = req.headers;


        if(!token){
            return res.status(401).json({ success: false, message: "Unauthorized login again" });
        }

    try {
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
        
        if(tokenDecode.id){
            req.body.userId = tokenDecode.id;
        }
        else{
            return res.status(401).json({ success: false, message: "Unauthorized login again" });
        }

        next();
        
    } catch (error) {
        console.log(error);
        res.status(401).json({ success: false, message: "Unauthorized" });
    }
};

export default userAuth;