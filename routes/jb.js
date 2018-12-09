const express = require("express");
const axios = require("axios");
const moment = require("moment");

const router = express.Router();
const { username, password, api_key } = require("../config");
const cache = {};
const FLAGS = "FLAGS";
const JOBS = "JOBS";
const RESOURCES = "RESOURCES";

cache[FLAGS] = {};
cache[JOBS] = {};
cache[RESOURCES] = {};

function outOfDate(then) {
  let now = new Date().getTime();

  if(now - then > 5 * 60 * 1000) {
    return true;
  }

  return false;
}

function updateCache(key, data) {
  let now = new Date().getTime();

  cache[key].time = now;
  cache[key].data = data;
}

router.get("/all-jobs", (req, res) => {
  if(!cache[JOBS].data || outOfDate(cache[JOBS].time)) {
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
      updateCache(JOBS, response.data.Result);
      res.send(response.data.Result);
    })
    .catch(err => {
      console.log(err);
    });
  } else {
    res.send(cache[JOBS].data);
  }
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
  if(!cache[RESOURCES].data || outOfDate(cache[RESOURCES].time)) {
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
      updateCache(RESOURCES, response.data.Result);
      res.send(response.data.Result);
    })
    .catch(err => {
      console.log(err);
    });
  } else {
    res.send(cache[RESOURCES].data);
  }
});

router.get("/flags", (req, res) => {
  if(!cache[FLAGS].data) {
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
      updateCache(FLAGS, response.data.Result);
      res.send(response.data.Result);
    })
    .catch(err => {
      console.log(err);
    });
  } else {
    res.send(cache[FLAGS].data);
  }
});

module.exports = router;
