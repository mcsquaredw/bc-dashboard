const SQL = require('sql-template-strings');

module.exports = (db, logger) => {
    async function isNotified(jobId, notificationType) {
        let notified;

        try {
            logger.info(`Checking if Job ID ${jobId} has been notified as ${notificationType}`);
            notified = await db.all(SQL`SELECT JobId FROM Notifications WHERE JobId=${jobId} AND NotificationType=${notificationType};`);

            logger.info(`Job ID ${jobId} ${notified.length > 0 ? `has been notified` : `has not been notified`} with type ${notificationType}`)
            return {result: notified.length > 0};
        } catch(err) {
            logger.error(`Error while getting issues: ${err}`);
            return {error: err};
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
        } catch(err) {
            logger.error(`Error while adding issues: ${err}`);

            return {
                error: err
            };
        }
    }

    return {
        isNotified,
        setNotified
    }
}



