import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
dotenv.config();

import User from '../models/User';
import { Request, Response } from 'express';

export const createUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const {email, fullName, password, profilePicture} = req.body;
        //check if the user already exist
        const userExists = await User.findOne({email: email});
        if (userExists) {
            res.status(400).json({
                success: false,
                message:
                "User already exists with same email. Please try with a different email",
            });
            return;
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = await User.create({fullName, email, password: hashedPassword, profilePicture: profilePicture || ''});

        if(!newUser) {
            res.status(404).json({
                success: false,
                message: 'User creation was unsuccessful'
            });
            return;
        } else {
            res.status(201).json({
                success: true,
                message: "User created successfully",
            });
        }
    } catch(e: any) {
        console.error('Error: ', e);
        res.status(500).json({
            success: false,
            message: "Something went wrong, please try again later"
        });
    }
}

export const loginUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        //check if the user exists
        const user = await User.findOne({email: email});
        if (!user) {
            res.status(400).json({
                success: false,
                message:
                "User doesn't exist. Enter a registered email",
            });
            return;
        }

        // check password
        if (!user.password) {
            res.status(500).json({
                success: false,
                message: "Password not set for this user.",
            });
            return;
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password!);
        if (!isPasswordMatch) {
            res.status(401).json({
                success: false,
                message: "Invalid password",
            });
            return;
        }
        // generate jwt token
        const secretKey = process.env.JWT_SECRET_KEY;
        if (!secretKey) {
            throw new Error(
                "JWT_SECRET_KEY not defined in environment variables"
            );
        }

        const accessToken = jwt.sign({
            userId: user._id,
            fullName: user.fullName
        }, secretKey, {
            expiresIn : '30m'
        });
        res.status(200).json({
            success: true,
            message: "Logged in successfully",
            accessToken
        });
    } catch(e: any) {
        console.error('Login error: ', e);
        res.status(500).json({
            success: false,
            message: "Something went wrong, please try again later"
        });
    }
}

export const updateName = async (req: Request, res: Response): Promise<void> => {
    try{
        const userId = (req as any).userInfo?.userId;
        const { fullName } = req.body;

        if (!fullName) {
            res.status(400).json({
                success: false,
                message: "Full name is required.",
            });
            return;
        }

        const updatedUser = await User.findByIdAndUpdate(userId, { fullName }, { new: true });
        if(!updatedUser) {
            res.status(404).json({
                success: false,
                message: "User not found.",
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Name updated successfully",
        });
    } catch(e: any) {
        console.error('Error', e)
        res.status(500).json({
            success: false,
            message: "Something went wrong, please try again later",
        });
    }
}

export const changePassword = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).userInfo?.userId;
        const { oldPassword, newPassword } = req.body;

        if(!oldPassword || !newPassword) {
            res.status(400).json({
                success: false,
                message: "Old password and new password are required.",
            });
            return;
        }

        //check if the user is logged in
        const user = await User.findById(userId);
        if (!user) {
            res.status(404).json({
                success: false,
                message: "User not found.",
            });
            return;
        }

        // check if old password is correct
        const isOldPasswordMatch = await bcrypt.compare(oldPassword, user.password!);
        if (!isOldPasswordMatch) {
            res.status(401).json({
                success: false,
                message: "Old password is incorrect.",
            });
            return;
        }

        // check if new password is same as old password
        if (oldPassword === newPassword) {
            res.status(400).json({
                success: false,
                message: "New password cannot be the same as old password.",
            });
            return;
        }
        // hash the new password and update it
        const salt = await bcrypt.genSalt(10);
        const hashedNewPassword = await bcrypt.hash(newPassword, salt);
        await User.findByIdAndUpdate(userId, { password: hashedNewPassword }, { new: true }); 
        res.status(200).json({
            success: true,
            message: "Password updated successfully",
        });

    } catch(e: any) {
        console.error('Error', e);
        res.status(500).json({
            success: false,
            message: "Something went wrong, please try again later",
        });
    }
}

export const blockUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).userInfo?.userId;
        const { userToBlockId } = req.body;

        // check if userToBlockId is provided
        if (!userToBlockId) {
            res.status(400).json({
                success: false,
                message: "User ID to block is required.",
            });
            return;
        }

        // check if the user is logged in
        const user = await User.findById(userId);
        if (!user) {
            res.status(404).json({
                success: false,
                message: "User not found.",
            });
            return;
        }

        // check if the user to block exists
        const userToBlock = await User.findById(userToBlockId);
        if (!userToBlock) {
            res.status(404).json({
                success: false,
                message: "User to block not found.",
            });
            return;
        }

        // check if the user is already blocked
        if (user.blockedUsers.includes(userToBlockId)) {
            res.status(400).json({
                success: false,
                message: "User is already blocked.",
            });
            return;
        }

        // block the user
        user.blockedUsers.push(userToBlockId);
        await user.save();

        res.status(200).json({
            success: true,
            message: "User blocked successfully",
        });
    } catch(e: any) {
        console.error('Error', e);
        res.status(500).json({
            success: false,
            message: "Something went wrong, please try again later",
        });
    }
}

export const unblockUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).userInfo?.userId;
        const { userToUnblockId } = req.body;

        // input field validation
        if(!userToUnblockId) {
            res.status(400).json({
                success: false,
                message: "User ID to block is required.",
            });
            return;
        }
        
        //check if user exists
        const user = await User.findById(userId);
        if(!user) {
            res.status(404).json({
                success: false,
                message: "User not found.",
            });
            return;
        }

        //check if the user to unblock exists
        const userToUnblock = await User.findById(userToUnblockId);
        if (!userToUnblock) {
          res.status(404).json({
            success: false,
            message: "User to block not found.",
          });
          return;
        }

        // check if the user exists in block list
        const isUserBlocked = user.blockedUsers.includes(userToUnblockId);
        if(!isUserBlocked) {
            res.status(400).json({
                success: false,
                message: "User is not blocked.",
            });
            return;
        }

        // unblock the user
        user.blockedUsers = user.blockedUsers.filter(id => id.toString() !== userToUnblockId);
        await user.save();

        res.status(200).json({
            success: true,
            message: "User unblocked successfully",
        });

    } catch(e: any) {
        console.error('Error', e);
        res.status(500).json({
            success: false,
            message: "Something went wrong, please try again later",
        });
    }
}

export const searchUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const email = req.query.email as string;
        if (!email) {
            res.status(400).json({
                success: false,
                message: "Email query parameter is required.",
            });
            return;
        }
        const user = await User.findOne({ email });
        if (!user) {
            res.status(404).json({
                success: false,
                message: "User not found.",
            });
            return;
        }
        const { password, ...safeUser } = user?.toObject();
        res.status(200).json({
            success: true,
            data: safeUser,
        });
    } catch(e: any) {
        console.error('Error', e);
        res.status(500).json({
            success: false,
            message: "Something went wrong, please try again later",
        });
    }
}