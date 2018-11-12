const express = require('express');
const app = express();
const port = 3000;
const axios = require('axios');
const { username, password, api_key } = require('./config');

app.use(express.static('public'));

app.get('/data/sales/:start/:end', (req, res) => {
  const { start, end } = req.params;

  axios.get(`https://webservice.bigchangeapps.com/v01/services.ashx?action=jobs&key=${api_key}&login=${username}&pwd=${password}&start=${start}&end=${end}`, {
    crossdomain: true,
    method: "GET",
    mode:"no-cors"
  }).then(response => {
    res.send(response.data);
  }).catch(err => {
    console.log(err);
  });
});

app.get('/data/to-order', (req, res) => {
  //TagId
  let now = new Date();
  now.setHours(0, 0, 0, 0);
  let toDate = new Date();
  toDate.setHours(0, 0, 0, 0);
  toDate.setDate(toDate.getDate() + 30);
  const nowStr = `${now.getFullYear()}-${('0' + (now.getMonth() + 1)).slice(-2)}-${('0' + now.getDate()).slice(-2)}`;
  const toDateStr = `${toDate.getFullYear()}-${('0' + (toDate.getMonth() + 1)).slice(-2)}-${('0' + toDate.getDate()).slice(-2)}`;

  axios.get(`https://webservice.bigchangeapps.com/v01/services.ashx?action=tags&key=${api_key}&login=${username}&pwd=${password}`, {
    crossdomain: true,
    method: "GET",
    mode: "no-cors"
  }).then(response => {
    let tagIds = [];
    let tagIdsStr = "";

    response.data.Result.map((item, index) => {
      if(item.tagName.includes("IF02") || item.tagName.includes("IF06") || item.tagName.includes("IF03")) {
        tagIds.push(item.Id);
      }
    });

    tagIds.map((item, index) => {
      tagIdsStr += (index > 0 ? "|" : "") + item;
    });

    axios.get(`https://webservice.bigchangeapps.com/v01/services.ashx?action=jobs&key=${api_key}&login=${username}&pwd=${password}&TagId=${tagIdsStr}&start=${nowStr}&end=${toDateStr}`, {
      crossdomain: true,
      method: "GET",
      mode:"no-cors"
    }).then(response => {
      res.send(response.data);
    })
  }).catch(err => {
    console.log(err);
  });
});

app.get('/data/jobs/:date', (req, res) => {
  const incomingDate = req.params.date;
  let toDate = new Date(req.params.date);
  toDate.setDate(toDate.getDate() + 1);
  const toDateStr = `${toDate.getFullYear()}-${('0' + (toDate.getMonth() + 1)).slice(-2)}-${('0' + toDate.getDate()).slice(-2)}`;

  axios.get(`https://webservice.bigchangeapps.com/v01/services.ashx?action=jobs&key=${api_key}&login=${username}&pwd=${password}&start=${incomingDate}&end=${toDateStr}`, {
    crossdomain: true,
    method: "GET",
    mode: "no-cors"
  }).then(response => {
    res.send(response.data);
  }).catch(err => {
    console.log(err);
  });
});



app.listen(port, () => {
  console.log("Listening on port", port);
});
