import nodemailer from "nodemailer";

export const sendEmail = async (options) => {
    // Create transporter
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.NODEMAILER_EMAIL,
          pass: process.env.NODEMAILER_EMAIL_PASS,
        },
    });

    // Email options
    const mailOptions = {
        from: process.env.NODEMAILER_EMAIL,
        to: options.email,
        subject: options.subject,
        text: options.message
    };

    // Send email
    await transporter.sendMail(mailOptions);
};