const axios = require('axios');
const { username, password, api_key } = require("../config");
const moment = require("moment");
const log4js = require('log4js');

let apiCalls = 0;

logger = log4js.getLogger('server');

module.exports = {
    getJobs: async () => {
        let response;

        apiCalls++;
        logger.info(`Getting details for jobs between ${moment("2018-11-01")} and ${moment().add(60, 'days')}`);
        logger.info(`Big Change API Calls Used: ${apiCalls}`);

        response = await axios.get(
            `https://webservice.bigchangeapps.com/v01/services.ashx?action=jobs&key=${api_key}&login=${username}&pwd=${password}&start=${moment("2018-11-01").format('YYYY-MM-DD')}&end=${moment().add(60, 'days').format('YYYY-MM-DD')}`
        );
        
        return response;
    },
    getOneJob: async (id) => {
        let response;

        apiCalls++;
        logger.info(`Getting details for job with ID ${jobId}`);
        logger.info(`Big Change API Calls Used: ${apiCalls}`);

        response = await axios.get(
            `https://webservice.bigchangeapps.com/v01/services.ashx?&key=${api_key}&login=${username}&pwd=${password}&action=job&jobId=${id}&flaghistory=1`
        );

        

        return response;
    },
    getResources: async() => {
        let response;

        apiCalls++;
        logger.info(`Getting resources`);
        logger.info(`Big Change API Calls Used: ${apiCalls}`);

        response = await axios.get(
            `https://webservice.bigchangeapps.com/v01/services.ashx?&key=${api_key}&login=${username}&pwd=${password}&action=live`
        );

        return response;
    },
    getFlags: async() => {
        let response;

        apiCalls++;
        logger.info(`Getting flags`);

        response = await axios.get(
            `https://webservice.bigchangeapps.com/v01/services.ashx?&key=${api_key}&login=${username}&pwd=${password}&action=tags`
        );

        logger.info(`Big Change API Calls Used: ${apiCalls}`);

        return response;
    },    
    setFlag: async(jobId, tagId) => {
        let response;

        apiCalls++;
        logger.info(`Setting flag for job with ID ${jobId} to flag with ID ${tagId}`);
        logger.info(`Big Change API Calls Used: ${apiCalls}`);

        response = await axios.get(
            `https://webservice.bigchangeapps.com/v01/services.ashx?&key=${api_key}&login=${username}&pwd=${password}&action=SetTag&EntityId=${jobId}&TagId=${tagId}&EntityType=job&datetime=${encodeURIComponent(moment().format("yyyy/mm/dd hh:mm:ss"))}`
        );  

        return response;
    },
    getWorksheets: async(jobId) => {
        let response;

        apiCalls++;
        logger.info(`Getting worksheets for job with ID ${jobId}`);
        logger.info(`Big Change API Calls Used: ${apiCalls}`);

        response = await axios.get(
            `https://webservice.bigchangeapps.com/v01/services.ashx?&key=${api_key}&login=${username}&pwd=${password}&action=jobworksheets&jobId=${jobId}&wsphoto=full`
        );
        
        return response;
    }
}