const axios = require('axios');
const { username, password, api_key } = require("../config");
const moment = require("moment");

module.exports = {
    getJobs: async function() {
        let response;

        try {
            response = await axios.get(
                `https://webservice.bigchangeapps.com/v01/services.ashx?action=jobs&key=${api_key}&login=${username}&pwd=${password}&start=${moment("2018-11-01").format('YYYY-MM-DD')}&end=${moment().add(60, 'days').format('YYYY-MM-DD')}`,
                {
                    crossdomain: true,
                    method: "GET",
                    mode: "no-cors"
                }
            );
        } catch (err) {
            console.error(err);
        }

        return response.data.Result;
    },
    getOneJob: async function (id) {
        let response;

        try {
            response = await axios
                .get(
                    `https://webservice.bigchangeapps.com/v01/services.ashx?&key=${api_key}&login=${username}&pwd=${password}&action=job&jobId=${id}&flaghistory=1`,
                    {
                        crossdomain: true,
                        method: "GET",
                        mode: "no-cors"
                    }
                );
        } catch (err) {
            console.error(err);
        }

        return response.data.Result;
    },
    getResources: async function () {
        let response;

        try {
            response = await axios
                .get(
                    `https://webservice.bigchangeapps.com/v01/services.ashx?&key=${api_key}&login=${username}&pwd=${password}&action=live`,
                    {
                        crossdomain: true,
                        method: "GET",
                        mode: "no-cors"
                    }
                );
        } catch (err) {
            console.error(err);
        }

        return response.data.Result;
    },
    getFlags: async function () {
        let response;

        try {
            response = await axios
                .get(
                    `https://webservice.bigchangeapps.com/v01/services.ashx?&key=${api_key}&login=${username}&pwd=${password}&action=tags`,
                    {
                        crossdomain: true,
                        method: "GET",
                        mode: "no-cors"
                    }
                );
        } catch (err) {
            console.error(err);
        }

        return response.data.Result;
    },
    setFlag: async function(jobId, tagId) {
        let response;
        let dateObj = new Date();

        try {
            response = await axios.get(
                `https://webservice.bigchangeapps.com/v01/services.ashx?&key=${api_key}&login=${username}&pwd=${password}&action=SetTag&EntityId=${jobId}&TagId=${tagId}&EntityType=job&datetime=${dateObj.getFullYear()}/${("0" + (dateObj.getMonth() + 1)).slice(-2)}/${("0" + dateObj.getDate()).slice(-2)}`
            )
        } catch (err) {
            console.error(err);
        }

        return response.data.Result;
    },
    getWorksheets: async function(jobId) {
        let response;

        console.log(jobId);
        
        try {
            response = await axios.get(
                `https://webservice.bigchangeapps.com/v01/services.ashx?&key=${api_key}&login=${username}&pwd=${password}&action=jobworksheets&jobId=${jobId}&wsphoto=full`
            )
        } catch(err) {
            console.error(err);
        }

        console.log(response.data.Result);

        return response.data.Result;
    }
}