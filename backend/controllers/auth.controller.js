import Staff from "../models/staff.model.js";
import { forgotPasswordEmail, sendEmail } from "../Email/emailsend.js";
import bcrypt from "bcryptjs";
import dotenv from 'dotenv';
import crypto from 'crypto'
import generateToken from "../utils/generatetoken.js";

dotenv.config();

export const add_user = async (req, res) => {
    try {
        const { staffname, staffId , email , password , department ,role  } = req.body;
        const emailregx = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if(!emailregx.test(email)){
            return res.status(400).json({error : "Invalid email Format"})
        }
        const existingstaff = await Staff.findOne({email});
        if(existingstaff){
            console.log("Staff already exits.")
            return res.status(400).json({error : "Staff is Already registered"})
        } 
        const staffIdCheck = await Staff.findOne({staffId});
        if(staffIdCheck){
            console.log("StaffId already exits.")
            return res.status(400).json({error : "StaffId is Already exists"});
        }
        
        if(password.lenght < 6){
            return res.status(400).json({error : "Password must have atleast 6 char lenght"});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedpassword = await bcrypt.hash(password , salt)

        const newstaff = new Staff({
            staffname,
            staffId,
            email,
            password : hashedpassword,
            department,
            role
        });

        if(newstaff){
            await newstaff.save();
            await sendEmail(staffname, email , password , staffId ,  department , role );
            res.status(201).json({newstaff});
        }
        else {
            res.status(400).json({ error: 'Invalid user.' });
        }
    } catch (error) {
        console.log("Error in the add_user controller :",error);
        res.status(500).json({error : "Inter server Error"});
    }
};

export const login = async( req , res)=>{
    try {
        const {email , password } = req.body;
        const staff = await Staff.findOne({email});
        const isPasswordCorrect = await bcrypt.compare(password , staff?.password || "");
        if(!staff || !isPasswordCorrect){
            return res.status(400).json({error : "Invalid Username or Password"});
        }
        generateToken(staff._id , res);
        res.status(200).json({staff});
    }
    catch(error){
        console.log("Error in the login controller :",error);
        res.status(500).json({error : "Inter server Error"});
    }
};

export const logout = async(req , res) => {
    try {
        res.cookie("jwt" , "" , { 
            httpOnly : true,
            secure : true,
            sameSite : "None",
            expires : new Date(0),
         });
        res.status(200).json({message : "Logout successfully"});
    }
    catch (error) {
        console.log("Error in logout controller.");
        res.status(500).json({error : "Internal Server Error"})
    }
}

export const getStaff = async(req , res) => {
    try {
        const staff = await Staff.findOne({_id : req.staff._id}).select("-password");
        res.status(200).json({
            "staffname" : staff.staffname,
            "staffId" : staff.staffId,
            "email" : staff.email,
            "department" : staff.department,
            "role" : staff.role,
            "theme" : staff.theme
        });
    } catch (error) {
        console.log("Error in getStaff controller.");
        res.status(500).json({error : "Internal Server Error"})
    }
}
//Forget Password
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
    
        // Validate email input
        if (!email) {
          return res.status(400).json({ error: 'Please provide an email address' });
        }
    
        // Find the user by email
        const user = await Staff.findOne({ email });
        if (!user) {
          return res.status(404).json({ error: 'No user found with that email' });
        }
    
        // Generate a reset token using crypto
        const resetToken = crypto.randomBytes(32).toString('hex');
    
        // Save the reset token in the database (you can add an expiration time for extra security)
        user.resetToken = resetToken;
        await user.save();
    
        // Construct the reset URL (client-side URL where the user will reset their password)
        const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    
        // Send the reset URL via email
        await forgotPasswordEmail(user.email, resetUrl);
    
        // Respond to the client that the reset email has been sent
        return res.status(200).json({ message: 'Password reset email sent!' });
    } catch (error) {
      console.error('Error in forgotPassword controller:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
}
