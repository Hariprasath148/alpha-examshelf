import mongoose from "mongoose";

const questionPaperSchema = new mongoose.Schema({
    Subject_ID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subject", // Reference to Subject collection
        required: true,
    },
    QuestionPaper_ID : {
        type : String,
        required : true,
        unique : true
    },
    topic : {
        type : String,
        required : true,
    },
    markBreakdown : {
        "mark_3" : {
            type : [String],
        },
        "mark_6" : {
            type : [String],
        },
        "mark_10" : {
            type : [String],
        },
    },
    googleID : {
        type : String,
    },
    preViewLink : {
        type : String,
    },
    downloadLink : {
        type : String,
    }
},{ timestamps : true });

const QuestionPaper = mongoose.model("QuestionPaper",questionPaperSchema);

export default QuestionPaper;