import mongoose from 'mongoose';

import { DB_NAME } from '../constants.js';

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`MongDB connected !! DB HOST:${connectionInstance.connection.host}`)
        console.log(`Connected to DB: ${mongoose.connection.name}`);

    }
    catch (error) {
        console.log("MONGODB connection error:", error);
        process.exit(1)
    }
}


export default connectDB;