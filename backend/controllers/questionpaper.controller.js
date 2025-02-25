import { uploadToGoogleDrive , deleteFromGoogleDrive} from "../googledrive/googledriveupload.js";
import Subject from "../models/subject.model.js"
import QuestionPaper from "../models/questionpaper.model.js";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { console } from "inspector";
import puppeteer from "puppeteer";
import chromium from '@sparticuz/chromium';
import puppeteerCore from 'puppeteer-core';

const generateUniqueQuestionID = (subjectName) => {
    const uniqueId = uuidv4();
    return `${subjectName}-${uniqueId}`; 
};

export const savePDF = async ( req , res ) => {
    try {
        const { topic , Subject_code } = req.body;
        const markBreakdown = {
            mark_3 : JSON.parse(req.body.mark_3),
            mark_6 : JSON.parse(req.body.mark_6) ,
            mark_10 : JSON.parse(req.body.mark_10)
        }
       
        const subject = await Subject.findOne({Subject_code});

        if(!subject) {
            return res.status(400).json({error : "Invail Subject informatiom"});
        }
        
        if(!topic==null || !markBreakdown == null) {
            return res.status(400).json({error : "topic or Question not found"});
        }
        const subject_Name = subject.Subject_name;
        const filePath = req.file.buffer;
        const fileName =  generateUniqueQuestionID(subject_Name);
        const fileMimeType = req.file.mimetype;
        const driveResponse = await uploadToGoogleDrive(filePath , fileName , fileMimeType);
        const downloadLink = `https://drive.google.com/uc?export=download&id=${driveResponse.id}`;

        const newQuestionPaper = new QuestionPaper({
            Subject_ID : subject._id,
            QuestionPaper_ID : fileName,
            topic : topic,
            markBreakdown : markBreakdown,
            googleID : driveResponse.id,
            preViewLink : driveResponse.webViewLink,
            downloadLink : downloadLink
        })

        if(newQuestionPaper) {
            await newQuestionPaper.save();
            subject.QuestionPaper.push(newQuestionPaper._id);
            await subject.save();
            
            res.status(201).json({
                message: "Question Paper added and linked to Subject successfully",
                questionPaper: newQuestionPaper,
                updatedSubject: subject
            });
        }

    } catch (error) {
        console.log("Error in the savePDF controller :",error);
        res.status(500).json({error : "Inter server Error"});
    }
};

// Add a new subject
export const add_subject = async (req, res) => {
    try {
        const { Subject_name, Subject_code } = req.body;

        const existingSubject = await Subject.findOne({ Subject_name });
        if (existingSubject) {
            return res.status(400).json({ error: "Subject already exists" });
        }

        const newSubject = new Subject({ Subject_name, Subject_code });
        await newSubject.save();

        res.status(201).json({ message: "Subject added successfully", subject: newSubject });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get subjects

export const get_subject = async (req, res) => {
    try {
        const subjects = await Subject.find({}, { Subject_name: 1 , Subject_code : 1 });  // Fetch only required fields
        
        // Check if no subjects were found
        if (subjects.length === 0) {
            return res.status(404).json({ error : "No subjects found" });
        }

        res.status(200).json(subjects);
    } catch (error) {
        res.status(500).json({ error: "Server error", error });
    }
};

export const get_questionPaper = async (req, res) => {
    try {
        const { Subject_code } = req.query; 

        const subject = await Subject.findOne({ Subject_code })
            .populate("QuestionPaper", "topic preViewLink downloadLink QuestionPaper_ID -_id");

        if (!subject) {
            return res.status(404).json({ error: 'Subject not found' });
        }

        res.status(200).json({ questionPaper: subject.QuestionPaper });

    } catch (error) {
        res.status(500).json({ message: "Internal Server error", error });
    }
};


export const generate_questionPaper = async (req , res ) => {
    try {
        const {htmlContent} = req.body;
        let browser = null;
        if (process.env.NODE_ENV === 'development') {
            browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            headless: true,
            });
        }
        if (process.env.NODE_ENV === 'production') {
            browser = await puppeteerCore.launch({
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath(),
            headless: chromium.headless,
            });
        }     
        const page = await browser.newPage();
        await page.setContent(htmlContent);
        await page.addStyleTag({
            content :`
                .header-container { 
                    break-inside: avoid !important; 
                    page-break-inside: avoid !important; 
                    page-break-before: avoid !important;
                    page-break-after: avoid !important;
                } 
                body{
                    line-height:0.5;
                } 
                .question-header {
                    font-size: 16px;
                    font-weight: bold;
                    text-align: center;
                } 
                td { 
                    line-height : 1.5; 
                } 
                .marks {
                    font-size: 16px;
                    font-weight: bold;
                    margin-bottom: 2px !important;
                    text-align: end;
                }
        `});
        const pdfBuffer = await page.pdf({ 
            width: "688px",
            height: "971px",
            margin: { top: "12mm", right: "12mm", bottom: "12mm", left: "12mm" },
            printBackground: true, 
        });
        await browser.close();
        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": "attachment; filename=QuestionPaper.pdf",
        });
        res.end(pdfBuffer);
    } catch (error) {
        res.status(500).json({ error : "Internal Server error", error });
    }
}

export const delete_questionPaper = async (req, res) => {
    try {
        const { QuestionPaper_ID } = req.body;
        const question_paper = await QuestionPaper.findOne({ QuestionPaper_ID });

        if (!question_paper) {
            return res.status(400).json({ error: "QuestionPaper Not Found" });
        }

        const result = await QuestionPaper.deleteOne({ _id: question_paper._id });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: "QuestionPaper not found" });
        }

        await Subject.updateMany(
            { QuestionPaper: question_paper._id }, 
            { $pull: { QuestionPaper: question_paper._id } }
        );

        const driveResponse = await deleteFromGoogleDrive(question_paper.googleID);

        if (driveResponse.success) {
            return res.status(200).json({ message: "QuestionPaper deleted and removed from Subjects" });
        } else {
            return res.status(500).json({ error: "QuestionPaper deleted, but failed to delete file from Google Drive" });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server error" });
    }
};

export const get_question = async(req,res)=>{
    try {
        const { Subject_code } = req.query;
        const subject = await Subject.findOne({Subject_code}).populate("QuestionPaper" , "markBreakdown -_id");
        if (!subject) {
            return res.status(404).json({ message: "Subject not found" });
        }
        const mark_3 = [];
        const mark_6 = [];
        const mark_10 = [];

        subject.QuestionPaper.forEach(qp => {
            if(qp.markBreakdown?.mark_3) mark_3.push(...qp.markBreakdown.mark_3);
            if(qp.markBreakdown?.mark_6) mark_6.push(...qp.markBreakdown.mark_6);
            if(qp.markBreakdown?.mark_10) mark_10.push(...qp.markBreakdown.mark_10);
        });

        res.status(200).json({mark_3 : mark_3 , mark_6 : mark_6 , mark_10 : mark_10});

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server error" });
    }
}