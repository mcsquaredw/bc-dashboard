const axios = require('axios');
const { username, password, api_key } = require("../config/config").vars;
const moment = require("moment");

let apiCalls = 0;

module.exports = (logger) => {
    async function getOrders() {
        let error;
        let response;

        try {
            apiCalls++;
            logger.info(`Getting details for jobs between ${moment("2018-11-01")} and ${moment().add(60, 'days')}`);
            logger.info(`Big Change API Calls Used: ${apiCalls}`);

            response = await axios.get(
                `https://webservice.bigchangeapps.com/v01/services.ashx?action=jobs&key=${api_key}&login=${username}&pwd=${password}&start=${moment("2018-11-01").format('YYYY-MM-DD')}&end=${moment().add(60, 'days').format('YYYY-MM-DD')}`
            );
        } catch (err) {
            error = err;
        }

        return {
            error,
            result: response.data.Result || {}
        }
    }

    async function getOneJob(id) {
        let error;
        let response;

        try {
            apiCalls++;
            logger.info(`Getting details for job with ID ${jobId}`);
            logger.info(`Big Change API Calls Used: ${apiCalls}`);

            const response = await axios.get(
                `https://webservice.bigchangeapps.com/v01/services.ashx?&key=${api_key}&login=${username}&pwd=${password}&action=job&jobId=${id}&flaghistory=1`
            );
        } catch (err) {
            error = err;
        }

        return {
            error,
            result: response.data.Result || {}
        }
    }

    async function getResources() {
        let error;
        let response;

        try {
            apiCalls++;
            logger.info(`Getting resources`);
            logger.info(`Big Change API Calls Used: ${apiCalls}`);

            response = await axios.get(
                `https://webservice.bigchangeapps.com/v01/services.ashx?&key=${api_key}&login=${username}&pwd=${password}&action=live`
            );
        } catch (err) {
            error = err;
        }

        return {
            error,
            result: response.data.Result || {}
        }
    }

    async function getFlags() {
        let error;
        let response;

        try {
            apiCalls++;
            logger.info(`Getting flags`);

            response = await axios.get(
                `https://webservice.bigchangeapps.com/v01/services.ashx?&key=${api_key}&login=${username}&pwd=${password}&action=tags`
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
                `https://webservice.bigchangeapps.com/v01/services.ashx?&key=${api_key}&login=${username}&pwd=${password}&action=SetTag&EntityId=${jobId}&TagId=${tagId}&EntityType=job&datetime=${encodeURIComponent(moment().format("yyyy/mm/dd hh:mm:ss"))}`
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
                `https://webservice.bigchangeapps.com/v01/services.ashx?&key=${api_key}&login=${username}&pwd=${password}&action=jobworksheets&jobId=${jobId}&wsphoto=full`
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
}