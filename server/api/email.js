const nodemailer = require("nodemailer");

module.exports = (config, logger) => {
    const { EMAIL_OUTGOING_SERVER, EMAIL_PASSWORD, EMAIL_USERNAME, EMAIL_DESTINATION } = config;

    let transporter = nodemailer.createTransport({
        host: EMAIL_OUTGOING_SERVER,
        port: 587,
        secure: false,
        auth: {
            user: EMAIL_USERNAME,
            pass: EMAIL_PASSWORD
        }
    });

    async function sendEmail(subject, text, html) {
        try {
            let mailOptions = {
                from: `"⚠️ JB Doors Alerts" <${EMAIL_USERNAME}>`,
                to: `${EMAIL_DESTINATION}`,
                subject,
                text, 
                html
            }
    
            logger.info(`Sending alert email to ${EMAIL_DESTINATION}`)
            //await transporter.sendMail(mailOptions);

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