import nodemailer from "nodemailer";

type EmailOptions = {
  email: string;
  subject: string;
  message: string;
};

const sendEmail = async (options: EmailOptions): Promise<void> => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || "587", 10),
      secure: false, // Note: true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: "Kyrillos Maher <hello@jonas.io>",
      to: options.email,
      subject: options.subject,
      text: options.message,
      // html: Optional HTML body
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error(error);
  }
};

export default sendEmail;
