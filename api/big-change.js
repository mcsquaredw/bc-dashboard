const axios = require('axios');
const { username, password, api_key } = require("../config");
const moment = require("moment");
const log4js = require('log4js');

let apiCalls = 0;

logger = log4js.getLogger('server');

module.exports = {
    getJobs: async function () {
        let response;

        apiCalls++;
        logger.info(`Getting details for jobs between ${moment("2018-11-01")} and ${moment().add(60, 'days')}`);

        try {
            response = await axios.get(
                `https://webservice.bigchangeapps.com/v01/services.ashx?action=jobs&key=${api_key}&login=${username}&pwd=${password}&start=${moment("2018-11-01").format('YYYY-MM-DD')}&end=${moment().add(60, 'days').format('YYYY-MM-DD')}`
            );
        } catch (err) {
            logger.error(`Error while getting jobs: ${err}`);
        }

        logger.info(`Big Change API Calls Used: ${apiCalls}`);
        
        return response.data.Result;
    },
    getOneJob: async function (id) {
        let response;

        apiCalls++;
        logger.info(`Getting details for job with ID ${jobId}`);

        try {
            response = await axios
                .get(
                    `https://webservice.bigchangeapps.com/v01/services.ashx?&key=${api_key}&login=${username}&pwd=${password}&action=job&jobId=${id}&flaghistory=1`
                );
        } catch (err) {
            logger.error(`Error while getting job details: ${err}`);
        }

        logger.info(`Big Change API Calls Used: ${apiCalls}`);

        return response.data.Result;
    },
    getResources: async function () {
        let response;

        apiCalls++;
        logger.info(`Getting resources`);

        try {
            response = await axios
                .get(
                    `https://webservice.bigchangeapps.com/v01/services.ashx?&key=${api_key}&login=${username}&pwd=${password}&action=live`
                );
        } catch (err) {
            logger.error(`Error while getting resources: ${err}`);
        }

        logger.info(`Big Change API Calls Used: ${apiCalls}`);

        return response.data.Result;
    },
    getFlags: async function () {
        let response;

        apiCalls++;
        logger.info(`Getting flags`);

        try {
            response = await axios
                .get(
                    `https://webservice.bigchangeapps.com/v01/services.ashx?&key=${api_key}&login=${username}&pwd=${password}&action=tags`
                );
        } catch (err) {
            logger.error(`Error while getting flags: ${err}`);
        }

        logger.info(`Big Change API Calls Used: ${apiCalls}`);

        return response.data.Result;
    },
    setFlag: async function (jobId, tagId) {
        let response;
        let dateObj = new Date();

        apiCalls++;
        logger.info(`Setting flag for job with ID ${jobId} to flag with ID ${tagId}`);

        try {
            response = await axios.get(
                `https://webservice.bigchangeapps.com/v01/services.ashx?&key=${api_key}&login=${username}&pwd=${password}&action=SetTag&EntityId=${jobId}&TagId=${tagId}&EntityType=job&datetime=${dateObj.getFullYear()}/${("0" + (dateObj.getMonth() + 1)).slice(-2)}/${("0" + dateObj.getDate()).slice(-2)}`
            );
        } catch (err) {
            logger.error(`Error while setting flag: ${err}`);
        }

        logger.info(`Big Change API Calls Used: ${apiCalls}`);

        return response.data.Result;
    },
    getWorksheets: async function (jobId) {
        let response;

        apiCalls++;
        logger.info(`Getting worksheets for job with ID ${jobId}`);

        try {
            response = await axios.get(
                `https://webservice.bigchangeapps.com/v01/services.ashx?&key=${api_key}&login=${username}&pwd=${password}&action=jobworksheets&jobId=${jobId}&wsphoto=full`
            );
        } catch (err) {
            logger.error(`Error while getting worksheets for job: ${err}`);
        }

        logger.info(`Big Change API Calls Used: ${apiCalls}`);

        return response.data.Result;
    }
}