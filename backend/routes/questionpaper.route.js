import express from "express";
import { delete_questionPaper, generate_questionPaper, get_question, get_questionPaper, savePDF} from "../controllers/questionpaper.controller.js";
import upload  from "../middleware/uploadPDF.js";
import { add_subject, get_subject } from '../controllers/questionpaper.controller.js'; 
const router = express.Router();


router.post("/save-question-paper",upload.single("file"),savePDF);
router.post("/add-subject",add_subject);
router.get("/get-subject",get_subject);
router.get("/get-questionPaper",get_questionPaper);
router.delete("/delete-questionPaper",delete_questionPaper);
router.get("/get-questions",get_question);
router.post("/generate-question-paper",generate_questionPaper);

export default router;
