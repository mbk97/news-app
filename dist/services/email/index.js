"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendCreateNewsEmail = exports.sendResetPasswordEmail = exports.sendWelcome = void 0;
const email_1 = require("../../utils/email");
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
    await (0, email_1.sendEmail)(email, subject, "", html);
};
exports.sendWelcome = sendWelcome;
const sendResetPasswordEmail = async ({ user, resetUrl }) => {
    const subject = "Password Reset Request";
    const text = ``;
    const html = `
    <p>Hello ${user.fullname},</p> <br />
    <p>You requested to reset your password. Please click the link below to set a new password:</p>
    <a href="${resetUrl}">Reset Password</a> <br />
    <p>This link will expire in 1 hour.</p> <br />
    <p>If you did not request this, please ignore this email.</p>  <br />
    <p>Best regards,<br>Your Team</p>
  `;
    await (0, email_1.sendEmail)(user.email, subject, text, html);
};
exports.sendResetPasswordEmail = sendResetPasswordEmail;
const sendCreateNewsEmail = async ({ newsTitle, createdBy }) => {
    const subject = "A New News Article Has Been Created";
    const text = ``;
    const html = `<html>
       <h5>Dear Abimbola Mubarak,</h5>
       A new article titled "${newsTitle}" has been created by ${createdBy}. <br />
       Please review it at your earliest convenience. <br />
       <br />
       Best regards, <br />
       Naija Daily.
      </html>`;
    await (0, email_1.sendEmail)("naijadailyad@gmail.com", subject, text, html);
};
exports.sendCreateNewsEmail = sendCreateNewsEmail;
//# sourceMappingURL=index.js.map