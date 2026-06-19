import jwt from "jsonwebtoken";
import User from "../Models/User.js";
import Token from "../Models/Token.js";
import config from "../config/EnvVar.js";

export default async (req, res, next) => {
    try {
        const token = req.cookies?.token || (req.headers.authorization && req.headers.authorization.split(" "));

        if (!token) {
            return res.redirect('/login');
        }

        let decoded;
        try {
            decoded = jwt.verify(token, config.jwt_token);
        } catch (err) {
            res.clearCookie('token');
            return res.redirect('/login');
        }

        const user = await User.findById(decoded.id);
        if (!user) {
            res.clearCookie('token');
            return res.redirect('/login');
        }

        const tokenDoc = await Token.findOne({ jti: decoded.jti });
        if (!tokenDoc) {
            res.clearCookie('token');
            return res.redirect('/login');
        }

        tokenDoc.lastUsedAt = new Date();
        await tokenDoc.save();

        req.user = user;
        req.tokenDoc = tokenDoc;
        next();        
    } catch (e) {
        console.error("Auth Middleware Error: ", e);
        res.clearCookie('token');
        return res.redirect('/login');
    }
}