import jwt from 'jsonwebtoken'
import config from '../config/EnvVar.js'

export default (req,res,next)=>{
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];
        
        if (!token)  return res.status(401).json({ status: false, message: "Access denied. Login session expired , please login again." });

        const decode = jwt.verify(token, config.jwt_token);

        req.user = {id: decode.id};

        next();
        
    } catch (e) {
        return res.status(401).json({ status: false, message: "token expired. login again", error:e });
    }
}