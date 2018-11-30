const express = require("express");
const router = express.Router();
const axios = require("axios");
const { username, password, api_key } = require("../config");
const moment = require("moment");

router.get("/sales/:start/:end", (req, res) => {
  const { start, end } = req.params;

  axios
    .get(
      `https://webservice.bigchangeapps.com/v01/services.ashx?action=jobs&key=${api_key}&login=${username}&pwd=${password}&start=${start}&end=${end}`,
      {
        crossdomain: true,
        method: "GET",
        mode: "no-cors"
      }
    )
    .then(response => {
      res.send(response.data);
    })
    .catch(err => {
      console.log(err);
    });
});

router.get("/to-order", (req, res) => {
  //TagId
  let now = new Date();
  now.setHours(0, 0, 0, 0);
  let toDate = new Date();
  toDate.setHours(0, 0, 0, 0);
  toDate.setDate(toDate.getDate() + 30);
  const nowStr = `${now.getFullYear()}-${("0" + (now.getMonth() + 1)).slice(
    -2
  )}-${("0" + now.getDate()).slice(-2)}`;
  const toDateStr = `${toDate.getFullYear()}-${(
    "0" +
    (toDate.getMonth() + 1)
  ).slice(-2)}-${("0" + toDate.getDate()).slice(-2)}`;

  axios
    .get(
      `https://webservice.bigchangeapps.com/v01/services.ashx?action=tags&key=${api_key}&login=${username}&pwd=${password}`,
      {
        crossdomain: true,
        method: "GET",
        mode: "no-cors"
      }
    )
    .then(response => {
      let tagIds = [];
      let tagIdsStr = "";

      response.data.Result.map((item, index) => {
        if (
          item.tagName.includes("IF02") ||
          item.tagName.includes("IF06") ||
          item.tagName.includes("IF03")
        ) {
          tagIds.push(item.Id);
        }
      });

      tagIds.map((item, index) => {
        tagIdsStr += (index > 0 ? "|" : "") + item;
      });

      axios
        .get(
          `https://webservice.bigchangeapps.com/v01/services.ashx?action=jobs&key=${api_key}&login=${username}&pwd=${password}&TagId=${tagIdsStr}&start=${nowStr}&end=${toDateStr}`,
          {
            crossdomain: true,
            method: "GET",
            mode: "no-cors"
          }
        )
        .then(response => {
          res.send(response.data);
        });
    })
    .catch(err => {
      console.log(err);
    });
});

router.get("/jobs/:date", (req, res) => {
  const incomingDate = req.params.date;
  let toDate = new Date(req.params.date);
  toDate.setDate(toDate.getDate() + 1);
  const toDateStr = `${toDate.getFullYear()}-${(
    "0" +
    (toDate.getMonth() + 1)
  ).slice(-2)}-${("0" + toDate.getDate()).slice(-2)}`;

  axios
    .get(
      `https://webservice.bigchangeapps.com/v01/services.ashx?action=jobs&key=${api_key}&login=${username}&pwd=${password}&start=${incomingDate}&end=${toDateStr}`,
      {
        crossdomain: true,
        method: "GET",
        mode: "no-cors"
      }
    )
    .then(response => {
      res.send(response.data);
    })
    .catch(err => {
      console.log(err);
    });
});

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
      res.send(response.data);
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
      res.send(response.data);
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
      res.send(response.data);
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
      res.send(response.data);
    })
    .catch(err => {
      console.log(err);
    });
});

module.exports = router;
