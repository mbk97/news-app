import { sendEmail } from "../../utils/email";

const sendWelcome = async ({ fullname, email, password }) => {
  const subject = "Welcome onboard";
  const html = `
        <html>
          <h5>Hello ${fullname}</h5>,
          Your account has been created successfully.<br />
          Login: ${email}<br />
          Password: ${password}<br />
          Please change your password after logging in.<br />
          Best regards,<br />Your Team.
        </html>
      `;
  await sendEmail(email, subject, "", html);
};

const sendResetPasswordEmail = async ({ user, resetUrl }) => {
  const subject = "Password Reset Request";
  const text = ``;
  const html = `
    <p>Hello ${user.fullname},</p>
    <p>You requested to reset your password. Please click the link below to set a new password:</p>
    <a href="${resetUrl}">Reset Password</a>
    <p>This link will expire in 1 hour.</p>
    <p>If you did not request this, please ignore this email.</p>
    <p>Best regards,<br>Your Team</p>
  `;

  await sendEmail(user.email, subject, text, html);
};

export { sendWelcome, sendResetPasswordEmail };
