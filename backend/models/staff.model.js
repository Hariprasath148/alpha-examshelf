import mongoose from "mongoose";

const StaffSchema = mongoose.Schema({
    staffname : {
        type : String,
        required : true,
    },
    staffId : {
        type : String,
        required : true,
        unique : true
    },
    email : {
        type : String ,
        unique : true,
        required : true
    },
    password : {
        type : String,
        default : "staff123",
        minLength : 6
    },
    department : {
        type : String,
        default : "BCA"
    },
    role : {
        type : String ,
        default : "staff",
    },
    theme : {
        type : String,
        default : "light"
    }
},{timestamps : true});

const Staff = mongoose.model("Staff",StaffSchema);
export default Staff;