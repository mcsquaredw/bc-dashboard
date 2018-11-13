const express = require("express");
const router = express.Router();
const axios = require("axios");
const sqlite3 = require("sqlite3").verbose();

let db = new sqlite3.Database("../data/database/gdn.db", err => {
  if (err) {
    console.error(err);
  }

  console.log("Connected");
});

module.exports = router;
