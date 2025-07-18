import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

interface AuthenticatedRequest extends Request {
  userInfo?: string | JwtPayload;
}

export const authMiddleware = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {

    // extracting the token from header
    const authHeader = req.headers['authorization'];
    console.log("Authorization Header:", authHeader);
    
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
        const decodedToken = jwt.verify(token, secretKey);
        console.log(decodedToken);
        req.userInfo = decodedToken;
        next();

    } catch(e) {
        console.error("JWT Verification Error:", e);
        res.status(401).json({
            success: false,
            message: "Invalid or expired token. Please login again.",
        });
    }
}