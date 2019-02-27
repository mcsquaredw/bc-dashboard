const moment = require('moment');

module.exports = (config, logger, db) => {
    const email = require('../api/email')(config, logger);
    const bigChangeApi = require('../api/big-change')(config, logger);

    function worksheetTable(worksheetData) {
        return `
            <table>
                ${worksheetData.map(question => {
            if (question.AnswerPhoto) {
                element = `<img width="400" height="224" src="data:image/png;base64, ${question.AnswerPhoto}" />`;
            } else if (question.AnswerText === "true") {
                element = `Yes`;
            } else if (question.AnswerText === "false") {
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
        let notificationDocument = await db.collection('notifications').findOne({ notificationType, jobId: job.JobId });

        if (!notificationDocument) {
            
            const worksheetResult = await bigChangeApi.getWorksheets(job.JobId);

            notificationDocument = {
                notificationType,
                jobId: job.JobId
            }

            if (worksheetResult.error) {
                logger.error(`Error while getting worksheet data: ${worksheetResult.error}`);
            } else {
                emailResult = await email.sendEmail(
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

                if (emailResult.error) {
                    logger.error(`Error while sending email: ${emailResult.error}`);
                } else {
                    await db.collection('notifications').insertOne(notificationDocument);
                }
            }
        }
    }

    async function notifySales(jobs) {
        await Promise.all(jobs
            .filter(job => job.Type.includes("Survey"))
            .filter(job => job.CurrentFlag)
            .filter(job => job.CurrentFlag.includes("SF03") || job.CurrentFlag.includes("SF04"))
            .map(async (job) => {
                try {
                    await processNotification(
                        job,
                        `New Sale - ${job.Contact} ${job.Postcode}`,
                        `<b>${job.Resource}</b> has sold to customer <b>${job.Contact}</b> at <b>${job.Postcode}</b>
                        <br />`,
                        `sales`
                    )
                } catch (err) {
                    logger.error(`Error occurred while notifying sales: ${err}`);
                }
            })
        );
    }

    async function notifyIssues(jobs) {
        await Promise.all(jobs
            .filter(job => job.Type.includes("Remedial") || job.Type.includes("Fitting"))
            .filter(job => job.Status.includes("issues"))
            .map(async (job) => {
                try {
                    await processNotification(
                        job,
                        `Job with Issues - ${job.Type} - ${job.Contact} ${job.Postcode}`,
                        `<b>${job.Type}</b> for <b>${job.Contact}</b> fitted by <b>${job.Resource}</b>
                        <br />
                        has been marked as <b>Completed with issues</b>
                        <br />
                        Please check the following worksheet data (if available) and take appropriate action:`,
                        'issue'
                    );
                } catch (err) {
                    logger.error(`Error occurred while notifying issues: ${err}`);
                }
            })
        );
    }

    function processNotifications(jobs) {
        logger.info("----- BEGIN NOTIFICATIONS -----");
        const filteredJobs = jobs.filter(job => moment(job.PlannedStart).isAfter(moment("24/01/2019", "DD/MM/YYYY")));

        Promise.all([
            notifyIssues(filteredJobs),
            notifySales(filteredJobs)
        ]).then(() => {
            logger.info("------ END NOTIFICATIONS ------");
        }).catch(err => {
            logger.error(err);
        })       
    }

    return {
        processNotifications
    }
};
