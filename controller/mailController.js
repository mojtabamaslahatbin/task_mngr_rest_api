const nodemailer = require("nodemailer");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, `../.env.local`) });
const { createConfirmationToken } = require("../utils/jwt");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS,
    },
});

exports.sendConfirmationEmail = ({ email, userId }) => {
    createConfirmationToken({ email, userId }, (error, result) => {
        if (error) {
            console.error(error);
        } else {
            transporter.sendMail({
                from: `Mojito Task Manager App <>${process.env.EMAIL}`,
                to: email,
                subject: "mojito task manager signup confirmation",
                html: `<a href="${process.env.EMAIL_CONFIRMATION_LINK}${result}">click for confirmation</a>`,
            });
            console.log(`href="${process.env.EMAIL_CONFIRMATION_LINK}${result}"`);
        }
    });
};
