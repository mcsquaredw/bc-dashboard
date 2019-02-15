const axios = require('axios');
const moment = require("moment");

module.exports = (config, logger) => {
    const { BC_USERNAME, BC_PASSWORD, BC_API_KEY, EPOCH } = config;
    const BC_URL = `https://webservice.bigchangeapps.com/v01/services.ashx?key=${BC_API_KEY}&login=${BC_USERNAME}&pwd=${BC_PASSWORD}`;

    async function getOrders() {
        let error;
        let result;

        try {
            logger.info(`Getting details for jobs between ${moment(EPOCH)} and ${moment().add(60, 'days')}`);

            const response = await axios.get(
                `${BC_URL}&action=jobs&start=${moment(EPOCH).format('YYYY-MM-DD')}&end=${moment().add(60, 'days').format('YYYY-MM-DD')}`
            );

            if(response.status === 200) {
                result = response.data.Result;
            } else {
                error = response.error;
            }
        
        } catch (err) {
            error = err;
        }

        return {
            error,
            result
        }
    }

    async function getOneJob(id) {
        let error;
        let result;

        try {
            logger.info(`Getting details for job with ID ${id}`);

            const response = await axios.get(
                `${BC_URL}&action=job&jobId=${id}&flaghistory=1`
            );

            if(response.status === 200) {
                result = response.data.Result;
            } else {
                error = response.error;
            }
        } catch (err) {
            error = err;
        }

        return {
            error,
            result
        }
    }

    /**
     * Gets all details for resources (people) from Big Change API, including speed and position tracking information if available
     * @returns {Promise<Result>}
     */
    async function getResources() {
        let error;
        let result;

        try {
            logger.info(`Getting resources`);

            const response = await axios.get(
                `${BC_URL}&action=live`
            );
            
            if(response.status === 200) {
                result = response.data.Result;
            } else {
                error = response.error;
            }
        } catch (err) {
            error = err;
        }

        return {
            error,
            result
        }
    }

    /**
     * Get all flag information using Big Change API, including label and colour
     * @returns {Promise<Result>}
     */
    async function getFlags() {
        let error;
        let result;

        try {            
            logger.info(`Getting flags`);

            const response = await axios.get(
                `${BC_URL}&action=tags`
            );

            if(response.status === 200) {
                result = response.data.Result;
            } else {
                error = response.error;
            }
        } catch (err) {
            error = err;
        }

        return {
            error,
            result
        }
    }

    async function setFlag(jobId, tagId) {
        let error;
        let result;

        try {
            logger.info(`Setting flag for job with ID ${jobId} to flag with ID ${tagId}`);

            const response = await axios.get(
                `${BC_URL}&action=SetTag&EntityId=${jobId}&TagId=${tagId}&EntityType=job&datetime=${encodeURIComponent(moment().format("yyyy/mm/dd hh:mm:ss"))}`
            );

            if(response.status === 200) {
                result = response.data.Result;
            } else {
                error = response.error
            }
        } catch (err) {
            error = err;
        }

        return {
            error,
            result
        }
    }

    async function getWorksheets(jobId) {
        let error;
        let result;

        try {
            logger.info(`Getting worksheets for job with ID ${jobId}`);

            const response = await axios.get(
                `${BC_URL}&action=jobworksheets&jobId=${jobId}&wsphoto=full`
            );

            if(response.status === 200) {
                result = response.data.Result;
            } else {
                error = response.error;
            }
        } catch (err) {
            error = err;
        }

        return {
            error,
            result
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