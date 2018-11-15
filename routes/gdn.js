const express = require("express");
const router = express.Router();
const axios = require("axios");
const sqlite3 = require("sqlite3");

router.get("/call_type", (req, res) => {
  let sql = `SELECT rowid, label FROM call_type
               ORDER BY label`;
  let db = new sqlite3.Database("./data/database/gdn.db");

  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error(err);
      res.sendStatus(500);
    }

    res.send(rows);
    db.close();
  });
});

router.get("/area", (req, res) => {
  let sql = `SELECT rowid, label FROM area
               ORDER BY label`;
  let db = new sqlite3.Database("./data/database/gdn.db");

  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error(err);
      res.sendStatus(500);
    }

    res.send(rows);
    db.close();
  });
});

router.get("/call_purpose", (req, res) => {
  let sql = `SELECT rowid, label FROM call_purpose
               ORDER BY label`;
  let db = new sqlite3.Database("./data/database/gdn.db");

  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error(err);
      res.sendStatus(500);
    }

    res.send(rows);
    db.close();
  });
});

router.get("/log-call/:call_type/:area/:call_purpose", (req, res) => {
  let { call_type, area, call_purpose } = req.params;
  let insert = `INSERT INTO call_log
             (call_type_id, area_id, call_purpose_id)
             VALUES
             (?, ?, ?)`;
  let db = new sqlite3.Database("./data/database/gdn.db");

  db.all(insert, [call_type, area, call_purpose], (err, rows) => {
    if (err) {
      console.error(err);
      res.sendStatus(500);
    }

    db.close();
  });
});

router.get("/today", (req, res) => {
  let now = new Date();
  now.setHours(0, 0, 0, 0);
  let end = new Date();
  end.setHours(23, 59, 59, 999);

  /*             SELECT call_log.id, call_type.label, area.label, call_purpose.label
             FROM   call_log, call_type, call_purpose, area
             WHERE  call_log.call_type_id = call_type.rowid
             AND    call_log.area_id = area.rowid
             AND    call_log.call_purpose_id = call_purpose.rowid
             AND    call_log.timestamp BETWEEN ? AND ?;*/
  let sql = `SELECT call_log.id, call_type.label, area.label, call_purpose.label
             FROM   call_log, call_type, area, call_purpose
             WHERE  call_log.call_type_id = call_type.id
             AND    call_log.area_id = area.id
             AND    call_log.call_purpose_id = call_purpose.id
             AND    call_log.timestamp BETWEEN ? AND ?`;
  let db = new sqlite3.Database("./data/database/gdn.db");

  db.all(
    sql,
    [
      now
        .toISOString()
        .replace("T", " ")
        .replace("Z", ""),
      end
        .toISOString()
        .replace("T", " ")
        .replace("Z", "")
    ],
    (err, rows) => {
      if (err) {
        console.error(err);
        res.sendStatus(500);
      }

      console.log(rows);
      res.send(rows);
      db.close();
    }
  );
});

module.exports = router;
