import mongoose from "mongoose";

const SubjectSchema=mongoose.Schema({
    Subject_name:{
        type:String,
        required:true,
        unique:true
    },
    Subject_code:{
        type:String,
        required:true,
        unique:true
    },
    QuestionPaper:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'QuestionPaper'
    }]
});

const Subject=mongoose.model("subject",SubjectSchema)
export default Subject ;