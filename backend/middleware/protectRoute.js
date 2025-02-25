import jwt from "jsonwebtoken"
import Staff  from "../models/staff.model.js"
 
const protectRoute = async ( req , res , next ) => {
    try {
        const token = req.cookies.jwt;
        if(!token) {
            return res.status(400).json({error : "Unauthorized Staff : No token provided"})
        }
        const decoded = jwt.verify(token , process.env.JWT_SECRET);

        if(!decoded) {
            return res.status(400).json({error : "Unauthorized Staff : Invalid token provided"})
        }

        const staff = await Staff.findOne({ _id : decoded.staffId}).select("-password");

        if(!staff) {
            return res.status(400).json({error : "Staff not found"});
        }
        
        req.staff = staff;
        next();

    } catch (error) {
        console.log("Error in protectRoute middleware :" ,error);
        res.status(500).json({error : "Internal server Error"});
    }
}

export default protectRoute;