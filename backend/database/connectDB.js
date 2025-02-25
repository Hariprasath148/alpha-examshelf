import mongoose from "mongoose";

const connectDB = async () =>{
    try {
        await mongoose.connect(process.env.MONGODBURL);
        console.log("database connected successfully..");
    } catch (error) {
        console.log("Error in connection DB :",error);
        process.exit(1);
    }
};

export default connectDB;