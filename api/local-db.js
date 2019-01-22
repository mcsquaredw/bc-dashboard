const SQL = require('sql-template-strings');

module.exports = (db, logger) => {
    async function isNotified(jobId) {
        let notified;

        try {
            logger.info(`Checking if Job ID ${jobId} has been notified`);
            notified = await db.all(SQL`SELECT JobId FROM Issues WHERE JobId=${jobId};`);

            logger.info(`Job ID ${jobId} ${notified.length > 0 ? `has been notified` : `has not been notified`}`)
            return {result: notified.length > 0};
        } catch(err) {
            logger.error(`Error while getting issues: ${err}`);
            return {error: err};
        }
    }

    async function setNotified(jobId) {
        let result;

        try {
            logger.info(`Logging Job ID ${jobId} as an Issue`);
            await db.all(SQL`INSERT INTO Issues (JobId) VALUES (${jobId});`);

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



