const config = require('../config/config').vars;
const env = (process.env.NODE_ENV ? process.env.NODE_ENV : "DEVELOPMENT").trim().toUpperCase();
const logger = require('./logging')(env);
const port = process.env.PORT ? process.env.PORT : 3000;
const https = require('./http')(config, env, port, logger);
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
let db;

MongoClient.connect(config.MONGO_URL, { useNewUrlParser: true }, (err, client) => {
    assert.equal(null, err);
    db = client.db(config.MONGO_DBNAME);
    require('./socket')(config, https, logger, db);
});

process.on('SIGINT', () => {
    logger.info("Shutting down");
});

