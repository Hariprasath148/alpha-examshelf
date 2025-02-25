import multer from "multer";
import fs from "fs";

const storage = multer.memoryStorage();
  
const upload = multer({
  storage : storage,
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = [
      "application/pdf", // PDF files
      "application/msword", // Word (.doc)
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // Word (.docx)
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only PDF and Word documents are allowed."));
    }
  },
});

export default upload;