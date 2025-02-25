import dotenv from 'dotenv';
dotenv.config();

import nodemailer from 'nodemailer';


// Create a transporter
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com', // SMTP server
  port: 587, // Port for TLS
  secure: false, // Use TLS
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSCODE,
  },
});

export const sendEmail = async ( staffname , email , password , staffId , department , role) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL, 
      to : email, 
      subject : "Welcome Invitation",
      text : "", 
      html : ` <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h2 style="color: #4CAF50;">Welcome to ExamShelf, ${staffname}!</h2>
      <p>We are excited to have you join our team and contribute to our shared goals and vision. At ExamShelf, we value teamwork, innovation, and dedication, and we're confident you'll make a significant impact.</p>

      <p>Here are your registration details:</p>
      
      <p><strong>Staff Name:</strong> ${staffname}</p>
      <p><strong>Staff ID:</strong> ${staffId}</p>
      <p><strong>Department:</strong> ${department}</p>
      <p><strong>Role:</strong> ${role}</p>

      <h3 style="color: #4CAF50;">Login Details</h3>
      <p>You can log in using the following credentials:</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Password:</strong> ${password}</p>
      <p><em>For security purposes, we recommend changing your password after your first login.</em></p>

      <p style="margin-top: 20px;">Thank you for joining ExamShelf. We look forward to working with you!</p>
      <p>Best regards,</p>
      <p><strong>The ExamShelf Team</strong></p>
    </div>
  `};

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

export const removeEmail = async ( email , staffname) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL, 
      to : email, 
      subject : "Notice: Account Removal from ExaShelf",
      text : "", 
      html : `<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; padding: 20px;">
      <h2 style="text-align: center; color: #d9534f;">Account Removal Notice</h2>
      <p>Hello,${staffname}</p>
      <p>We regret to inform you that your account has been removed from <strong>ExaShelf</strong>. If you believe this action was taken in error or require further clarification, please reach out to your administrator for more details.</p>
      <p style="margin-top: 20px;">Here are the next steps you can take:</p>
      <ul>
        <li>Contact your administrator for additional information.</li>
        <li>If you have any urgent concerns, feel free to email our support team.</li>
      </ul>
      <p style="margin-top: 20px;">We apologize for any inconvenience caused.</p>
      <p style="margin-top: 40px; text-align: center;">
        Contact Administrator for more Details..
      </p>
    </div>
  `};
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

export const forgotPasswordEmail = async ( email  , resetUrl ) => {
  try {
    const mailOptions = {
      from: "examshelf.team@gmail.com", 
      to : email, 
      subject : "Forgot passsword",
      text : "", 
      html : `${resetUrl}`
    };
    console.log(resetUrl);
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};


