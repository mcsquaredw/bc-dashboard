const { emailoutgoingserver, emailpassword, emailusername, alertemail } = require('../config/config').vars;
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
                to: `${alertemail}`,
                subject,
                text, 
                html
            }
    
            logger.info(`Sending alert email to ${alertemail}`)
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