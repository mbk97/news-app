import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "naijadailyad@gmail.com", // Your email address
    pass: "qpqw thnm hvat hgsd", // Your email password
    // user: "oyindamola850@gmail.com", // Your email address
    // pass: "fzsz mbxr lhcm dcef", // Your email password
  },
  tls: {
    ciphers: "SSLv3",
  },
});

const sendEmail = async (
  to: string,
  subject: string,
  text: string,
  html: string
) => {
  const mailOptions = {
    from: "naijadailyad@gmail.com",
    to,
    subject,
    text,
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

export { sendEmail };
