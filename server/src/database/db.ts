import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';

export const connectToDB = async () => {
    const mongoURI = process.env.MONGO_URI;
    if(!mongoURI) {
        console.error("MONGO_URI is not defined in the environment variables.");
        process.exit(1);
    }
    try {
        await mongoose.connect(mongoURI);
        console.log("Successfully connected to MongoDB.");
    } catch(e) {
        console.error(`Error ${e} occurred while connecting to mongoDB`);
    }
}