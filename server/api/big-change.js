const axios = require('axios');
const moment = require("moment");

module.exports = (config, logger) => {
    let apiCalls = 0;
    const { BC_USERNAME, BC_PASSWORD, BC_API_KEY, EPOCH } = config;
    const BC_URL = `https://webservice.bigchangeapps.com/v01/services.ashx?key=${BC_API_KEY}&login=${BC_USERNAME}&pwd=${BC_PASSWORD}`;

    async function getOrders() {
        let error;
        let response;

        try {
            logger.info(`Getting details for jobs between ${moment(EPOCH)} and ${moment().add(60, 'days')}`);
            logger.info(`Big Change API Calls Used: ${++apiCalls}`);

            response = await axios.get(
                `${BC_URL}&action=jobs&start=${moment(EPOCH).format('YYYY-MM-DD')}&end=${moment().add(60, 'days').format('YYYY-MM-DD')}`
            );
        } catch (err) {
            error = err;
        }

        return {
            error,
            result: response.data ? response.data.Result : {}
        }
    }

    async function getOneJob(id) {
        let error;
        let response;

        try {
            logger.info(`Getting details for job with ID ${id}`);
            logger.info(`Big Change API Calls Used: ${++apiCalls}`);

            response = await axios.get(
                `${BC_URL}&action=job&jobId=${id}&flaghistory=1`
            );
        } catch (err) {
            error = err;
        }

        return {
            error,
            result: response.data.Result || {}
        }
    }


    /**
     * Gets all details for resources (people) from Big Change API, including speed and position tracking information if available
     * @returns {Promise<Result>}
     */
    async function getResources() {
        let error;
        let response;

        try {
            logger.info(`Getting resources`);
            logger.info(`Big Change API Calls Used: ${++apiCalls}`);

            response = await axios.get(
                `${BC_URL}&action=live`
            );
        } catch (err) {
            error = err;
        }

        return {
            error,
            result: response.data.Result || {}
        }
    }

    /**
     * Get all flag information using Big Change API, including label and colour
     * @returns {Promise<Result>}
     */
    async function getFlags() {
        let error;
        let response;

        try {
            apiCalls++;
            logger.info(`Getting flags`);

            response = await axios.get(
                `${BC_URL}&action=tags`
            );

            logger.info(`Big Change API Calls Used: ${apiCalls}`);
        } catch (err) {
            error = err;
        }

        return {
            error,
            result: response.data.Result || {}
        }
    }

    async function setFlag(jobId, tagId) {
        let error;
        let response;

        try {
            apiCalls++;
            logger.info(`Setting flag for job with ID ${jobId} to flag with ID ${tagId}`);
            logger.info(`Big Change API Calls Used: ${apiCalls}`);

            response = await axios.get(
                `${BC_URL}&action=SetTag&EntityId=${jobId}&TagId=${tagId}&EntityType=job&datetime=${encodeURIComponent(moment().format("yyyy/mm/dd hh:mm:ss"))}`
            );
        } catch (err) {
            error = err;
        }

        return {
            error,
            result: response.data.Result || {}
        }
    }

    async function getWorksheets(jobId) {
        let error;
        let response;

        try {
            apiCalls++;
            logger.info(`Getting worksheets for job with ID ${jobId}`);
            logger.info(`Big Change API Calls Used: ${apiCalls}`);

            response = await axios.get(
                `${BC_URL}&action=jobworksheets&jobId=${jobId}&wsphoto=full`
            );
        } catch (err) {
            error = err;
        }

        return {
            error,
            result: response.data.Result || {}
        }
    }

    return {
        getOrders, 
        getOneJob,
        getResources,
        getFlags,
        setFlag,
        getWorksheets
    }
};