const moment = require('moment');

module.exports = (config, logger, db) => {
    const email = require('../api/email')(config, logger);

    async function processReport(reportType, jobs, emailSubject, emailText) {
        let reportRun = await db.collection('reports').findOne({ reportType, reportDate: moment().format("DD/MM/YYYY") });

        if(!reportRun) {
            reportRun = {
                reportType,
                reportDate: moment().format("DD/MM/YYYY")
            }
            const emailResult = await email.sendEmail(
                emailSubject,
                ``,
                `
                    ${emailText}
                    <br />
                    <table style="border: 1px solid black;">
                        <tr>
                            <td style="padding: 5px; font-weight: bold;">Planned Fitting Date</td>
                            <td style="padding: 5px; font-weight: bold;">Job Type</td>
                            <td style="padding: 5px; font-weight: bold;">Customer Name</td>
                            <td style="padding: 5px; font-weight: bold;">Customer Postcode</td>
                            <td style="padding: 5px; font-weight: bold;">Current Flag</td>
                        <tr>
                    ${jobs.map((job, index) => {
                        return `
                            <tr ${index % 2 == 0 ? `style="background-color: lightgrey"` : '' }>
                                <td style="padding: 5px;">${moment(job.PlannedStart).format("DD/MM/YYYY")}</td>
                                <td style="padding: 5px;">${job.Type}</td>
                                <td style="padding: 5px;">${job.Contact}</td>
                                <td style="padding: 5px;">${job.Postcode}</td>
                                <td style="padding: 5px;">${job.CurrentFlag ? job.CurrentFlag : "No Flag"}</td>
                            </td>
                        `;
                    }).join('')}
                    </table>
                `
            );
    
            if(emailResult.error) {
                logger.error(`Error while sending email: ${emailResult.error}`);
            } else {
                await db.collection('reports').insertOne(reportRun);
            }
        }
    }

    async function notDelivered(jobs) {
        processReport(
            'notdelivered',
            jobs
            .filter(job => job.Type.includes("Fitting") && !job.Type.includes("Motor"))
            .filter(job => job.PlannedStart && moment(job.PlannedStart).isBefore(moment().add(7, 'day')))
            .filter(job => !job.CurrentFlag || (!job.CurrentFlag.includes("Paid") && !job.CurrentFlag.includes("IF01"))),
            `Daily Report - Not Delivered and Fitting Within 7 Days`,
            `Doors for the following jobs are not marked as delivered, and are due for fitting in the next 7 days`
        );
    }

    async function noFlag(jobs) {
        processReport(
            'noflag',
            jobs
            .filter(job => !job.CurrentFlag)
            .filter(job => job.Type.includes("Fitting"))
            .filter(job => !job.Type.includes("Motor")),
            `Daily Report - Jobs with No Flag`,
            `The following jobs have no flag set - without these flags being set it is difficult to run reports.`
        );
    }

    function processReports(jobs) {
        logger.info("----- BEGIN REPORTS -----");
        const filteredJobs = jobs
                                .filter(job => moment(job.PlannedStart).isAfter(moment("27/01/2019", "DD/MM/YYYY")))
                                .sort((a, b) => new Date(a.PlannedStart) - new Date(b.PlannedStart));

        Promise.all([
            noFlag(filteredJobs),
            notDelivered(filteredJobs)
        ]).catch(err => {
            logger.error(`Error processing reports: ${err}`)
        });
    }

    return {
        processReports
    }
}