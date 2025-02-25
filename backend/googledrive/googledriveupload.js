import { google } from "googleapis";
import fs from "fs";
import { Readable } from "stream";

const apikey = JSON.parse(process.env.GOOGLE_API_SECRET_KEY);

const authenticateGoogle = () => {
    const auth = new google.auth.GoogleAuth({
        credentials : apikey,
        scopes: ["https://www.googleapis.com/auth/drive.file"],
    });
    return auth;
};

export const uploadToGoogleDrive = async ( filePath , fileName , fileMimeType) => {
    const auth = authenticateGoogle();
    const drive = google.drive({ version : "v3" , auth });

    const fileMetadata = {
        name : fileName,
        parents : ["1bx0vxKkbJyAa9MBZU9RvK0fZZx2Eglq1"]
    }

    const media = {
        mimeType : fileMimeType,
        body : Readable.from(filePath),
    };
    
    const response = await drive.files.create({
        resource : fileMetadata,
        media : media,
        fields : "id,webViewLink,webContentLink"
    });

    const fileId = response.data.id;
    
    await drive.permissions.create({
      fileId: fileId,
      requestBody: {
        role: "reader",  
        type: "anyone", 
      },
    });

    return response.data;
}

export const deleteFromGoogleDrive = async (googleDriveID) => {
    const auth = authenticateGoogle();
        const drive = google.drive({ version: "v3", auth });

        await drive.files.delete({
            fileId: googleDriveID,
        });

        return { success: true };
}
