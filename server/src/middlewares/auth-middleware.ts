import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import User from '../models/User';
import dotenv from 'dotenv';
dotenv.config();

interface AuthenticatedRequest extends Request {
  user?: any;
}

export const authMiddleware = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {

    // extracting the token from header
    const authHeader = req.headers['authorization'];    
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
    res.status(401).json({
        success: false,
        message: "Access denied, No token provided. Please login to continue",
        });
        return;
    }

    try {

        // extracting the payload from decoding the token
        const secretKey = process.env.JWT_SECRET_KEY;
        if(!secretKey) {
            throw new Error(
                'JWT_SECRET_KEY is not defined in environment variables'
            );
        }
        const decodedToken = jwt.verify(token, secretKey) as JwtPayload;
        const user = await User.findById(decodedToken.userId).select("-password");

        if (!user) {
            res.status(401).json({ message: "Invalid token, user not found." });
            return;
        }

        req.user = user;
        next();

    } catch(e) {
        console.error("JWT Verification Error:", e);
        res.status(401).json({
            success: false,
            message: "Invalid or expired token. Please login again.",
        });
    }
}