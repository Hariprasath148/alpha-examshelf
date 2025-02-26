import express from "express";
import dotenv from "dotenv";
import authRoute from "./routes/auth.route.js";
import connectDB from "./database/connectDB.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import staffRoute from "./routes/staff.route.js";
import questionPaperRoute from "./routes/questionpaper.route.js";

dotenv.config();

const PORT = process.env.PORT || 5500;
const app = express();

app.use(express.json());
app.use(cors({
    origin: process.env.APPLICATION_URL,
    credentials: true
}));

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }))

app.use("/api/auth", authRoute);
app.use("/api/staff", staffRoute);
app.use("/api/questionpaper", questionPaperRoute);

app.use("/",(req,res)=>{
    res.send("this is the home route");
})

app.listen(PORT, () => {
    console.log("Server is running on port:", PORT);
    connectDB();
});
