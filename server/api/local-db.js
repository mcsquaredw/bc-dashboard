const SQL = require('sql-template-strings');
const moment = require('moment');

module.exports = (db, logger) => {
    async function reportRun(reportType) {
        let run;
        let today = moment().format("DD/MM/YYYY");

        try {
            logger.info(`Checcking if report ${reportType} has been run for date ${today}`);
            run = await db.all(SQL`SELECT reportType FROM Reports WHERE reportType=${reportType} AND reportDate=${today}`);

            logger.info(`Report type ${reportType} ${run.length > 0 ? `has been run for` : `has not been run for`} date ${today}`);
            return { result: run.length > 0 };
        } catch (err) {
            logger.error(`Error while checking report run: ${err}`);
            return { error: err };
        }
    }

    async function setReportRun(reportType) {
        let result;
        let today = moment().format("DD/MM/YYYY");

        try {
            logger.info(`Logging Report ${reportType} as run for ${today}`);
            result = await db.all(SQL`INSERT INTO Reports (reportType, reportDate) VALUES (${reportType}, ${today});`);

            return {
                result
            };
        } catch (err) {
            logger.error(`Error while logging report run: ${err}`);

            return {
                error: err
            };
        }
    }

    async function isNotified(jobId, notificationType) {
        let notified;

        try {
            logger.info(`Checking if Job ID ${jobId} has been notified as ${notificationType}`);
            notified = await db.all(SQL`SELECT JobId FROM Notifications WHERE JobId=${jobId} AND NotificationType=${notificationType};`);

            logger.info(`Job ID ${jobId} ${notified.length > 0 ? `has been notified` : `has not been notified`} with type ${notificationType}`)
            return { result: notified.length > 0 };
        } catch (err) {
            logger.error(`Error while getting issues: ${err}`);
            return { error: err };
        }
    }

    async function setNotified(jobId, notificationType) {
        let result;

        try {
            logger.info(`Logging Job ID ${jobId} with type ${notificationType}`);
            result = await db.all(SQL`INSERT INTO Notifications (JobId, NotificationType) VALUES (${jobId}, ${notificationType});`);

            return {
                result
            };
        } catch (err) {
            logger.error(`Error while adding issues: ${err}`);

            return {
                error: err
            };
        }
    }

    return {
        isNotified,
        setNotified,
        reportRun,
        setReportRun
    }
}



