"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendCreateNewsEmail = exports.sendResetPasswordEmail = exports.sendWelcome = void 0;
const email_1 = require("../../utils/email");
const sendWelcome = (_a) => __awaiter(void 0, [_a], void 0, function* ({ fullname, email, password }) {
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
    yield (0, email_1.sendEmail)(email, subject, "", html);
});
exports.sendWelcome = sendWelcome;
const sendResetPasswordEmail = (_b) => __awaiter(void 0, [_b], void 0, function* ({ user, resetUrl }) {
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
    yield (0, email_1.sendEmail)(user.email, subject, text, html);
});
exports.sendResetPasswordEmail = sendResetPasswordEmail;
const sendCreateNewsEmail = (_c) => __awaiter(void 0, [_c], void 0, function* ({ newsTitle, createdBy }) {
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
    yield (0, email_1.sendEmail)("naijadailyad@gmail.com", subject, text, html);
});
exports.sendCreateNewsEmail = sendCreateNewsEmail;
//# sourceMappingURL=index.js.map