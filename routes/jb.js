const express = require("express");
const axios = require("axios");
const moment = require("moment");

const router = express.Router();
const { username, password, api_key } = require("../config");

router.get("/all-jobs", (req, res) => {

    axios
    .get(
      `https://webservice.bigchangeapps.com/v01/services.ashx?action=jobs&key=${api_key}&login=${username}&pwd=${password}&start=${moment("2018-11-01").format('YYYY-MM-DD')}&end=${moment().add(60, 'days').format('YYYY-MM-DD')}`,
      {
        crossdomain: true,
        method: "GET",
        mode: "no-cors"
      }
    )
    .then(response => {
      res.send(response.data.Result);
    })
    .catch(err => {
      console.log(err);
    });
});

router.get("/job/:id", (req, res) => {
  const { id } = req.params;

  axios
    .get(
      `https://webservice.bigchangeapps.com/v01/services.ashx?&key=${api_key}&login=${username}&pwd=${password}&action=job&jobId=${id}&flaghistory=1`,
      {
        crossdomain: true,
        method: "GET",
        mode: "no-cors"
      }
    )
    .then(response => {
      res.send(response.data.Result);
    })
    .catch(err => {
      console.log(err);
    });
});

router.get("/resources", (req, res) => {
    axios
    .get(
      `https://webservice.bigchangeapps.com/v01/services.ashx?&key=${api_key}&login=${username}&pwd=${password}&action=live`,
      {
        crossdomain: true,
        method: "GET",
        mode: "no-cors"
      }
    )
    .then(response => {
      res.send(response.data.Result);
    })
    .catch(err => {
      console.log(err);
    });
});

router.get("/flags", (req, res) => {
    axios
    .get(
      `https://webservice.bigchangeapps.com/v01/services.ashx?&key=${api_key}&login=${username}&pwd=${password}&action=tags`,
      {
        crossdomain: true,
        method: "GET",
        mode: "no-cors"
      }
    )
    .then(response => {
      res.send(response.data.Result);
    })
    .catch(err => {
      console.log(err);
    });
});

module.exports = router;
