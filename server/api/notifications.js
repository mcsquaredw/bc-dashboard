const moment = require('moment');

module.exports = (db, logger) => {
    const localDb = require('../api/local-db')(db, logger);
    const email = require('../api/email')(logger);
    const bigChangeApi = require('../api/big-change')(logger);

    function worksheetTable(worksheetData) {
        return `
            <table>
                ${worksheetData.map(question => {
                    if(question.AnswerPhoto) {
                        element = `<img width="400" height="224" src="data:image/png;base64, ${question.AnswerPhoto}" />`;
                    } else if(question.AnswerText === "true") {
                        element = `Yes`;
                    } else if(question.AnswerText === "false") {
                        element = `No`;
                    } else {
                        element = `${question.AnswerText}`;
                    }

                    return `
                    <tr>
                        <td>
                            <b>${question.Question}</b>
                        </td>
                        <td>
                            ${element}
                        </td>
                    </tr>
                    `
                }).join('')}
            </table>
        `;
    }

    async function processNotification(job, emailSubject, emailText, notificationType) {
        const notificationResult = await localDb.isNotified(job.JobId, notificationType);

        if(notificationResult.error) {
            logger.error(`Error while checking notification status: ${notificationResult.error}`);
        } else if(!notificationResult.result) {
            const worksheetResult = await bigChangeApi.getWorksheets(job.JobId);

            if(worksheetResult.error) {
                logger.error(`Error while getting worksheet data: ${worksheetResult.error}`);
            } else {
                const emailResult = await email.sendEmail(
                    emailSubject,
                    ``,
                    `
                        ${emailText}
                        <br />
                        ${worksheetResult && worksheetResult.result.length > 0 ?
                            worksheetTable(worksheetResult.result)
                            :
                            `<tr><td>No worksheet data available</td></tr>`
                        }
                    `
                );

                if(emailResult.error) {
                    logger.error(`Error while sending email: ${emailResult.error}`);
                } else {
                    const saveNotificationResult = await localDb.setNotified(job.JobId, notificationType);

                    if(saveNotificationResult.error) {
                        logger.error(`Error saving notification status: ${saveNotificationResult.error}`)
                    } 
                }
            } 
        }
    }

    async function notifySales(jobs) {
        jobs
        .filter(job => job.Type.includes("Survey"))
        .filter(job => job.CurrentFlag)
        .filter(job => job.CurrentFlag.includes("SF03") || job.CurrentFlag.includes("SF04"))
        .map(async(job) =>
            processNotification(
                job,
                `New Sale - ${job.Contact} ${job.Postcode}`,
                `<b>${job.Resource}</b> has sold to customer <b>${job.Contact}</b> at <b>${job.Postcode}</b>
                <br />`,
                `sales`
            )
        );
    }

    async function notifyIssues(jobs) {
        jobs
        .filter(job => job.Type.includes("Remedial") || job.Type.includes("Fitting"))
        .filter(job => job.Status.includes("issues"))
        .map(async(job) => 
            processNotification(
                job,
                `Job with Issues - ${job.Type} - ${job.Contact} ${job.Postcode}`,
                `<b>${job.Type}</b> for <b>${job.Contact}</b> fitted by <b>${job.Resource}</b>
                <br />
                has been marked as <b>Completed with issues</b>
                <br />
                Please check the following worksheet data (if available) and take appropriate action:`,
                'issue'
            )
        )
    }

    function processNotifications(jobs) {
        logger.info("----- BEGIN NOTIFICATIONS -----");
        const filteredJobs = jobs.filter(job => moment(job.PlannedStart).isAfter(moment("24/01/2019", "DD/MM/YYYY")));

        Promise.all([
            notifySales(filteredJobs),
            notifyIssues(filteredJobs)
        ]).catch(err => {
            logger.error(err);
        });
    }

    return {
        processNotifications
    }
};
