import jwt from 'jsonwebtoken'
import config from '../config/EnvVar.js'
import User from '../Models/User.js';
import Token from '../Models/Token.js';

export default async (req,res,next)=>{
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) return res.status(401).json({ message: "No token provided." });

        const token = authHeader.split(" ")[1];

        let decoded;
        try {
            decoded = jwt.verify(token, config.jwt_token);
        } catch (err) {
            return res.status(401).json({ message: "Invalid or expired token." });
        }

        const user = await User.findById(decoded.id);
        if (!user) return res.status(401).json({ message: "User not found." });

        const tokenDoc = await Token.findOne({ jti: decoded.jti });
        if (!tokenDoc) {
            return res.status(401).json({ message: "Token has been revoked. Please login again." });
        }

        tokenDoc.lastUsedAt = new Date();
        await tokenDoc.save();

        req.user = user;
        req.tokenDoc = tokenDoc;
        next();        
    } catch (e) {
        return res.status(401).json({ status: false, message: "token expired. login again", error:e });
    }
}