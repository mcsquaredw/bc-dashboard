const { emailoutgoingserver, emailpassword, emailusername } = require('../config/config').vars;
const nodemailer = require("nodemailer");

module.exports = (logger) => {
    let transporter = nodemailer.createTransport({
        host: emailoutgoingserver,
        port: 587,
        secure: false,
        auth: {
            user: emailusername,
            pass: emailpassword
        }
    });

    async function sendEmail(subject, text, html) {
        try {
            let mailOptions = {
                from: `"JB Doors Alerts" <${emailusername}>`,
                to: `${emailusername}`,
                subject,
                text, 
                html
            }
    
            logger.info(`Sending alert email to ${emailusername}`)
            await transporter.sendMail(mailOptions);

            return { error: "" }
        } catch(err) {
            logger.error(`Error while sending email: ${err}`);
            return { error: err };
        }
    }

    return {
        sendEmail
    };
}