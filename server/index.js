const config = require('../config/config').vars;
const env = (process.env.NODE_ENV ? process.env.NODE_ENV : "development").trim().toUpperCase();
const logger = require('./logging')(env);
const port = process.env.PORT ? process.env.PORT : 3000;

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

assert(config.BC_API_KEY, "Big Change API Key not present");
assert(config.BC_USERNAME, "Big Change Username not present");
assert(config.BC_PASSWORD, "Big Change Password not present");
assert(config.CERT, "HTTPS Certificate path not present");
assert(config.KEY, "HTTPS Key path not present");
assert(config.COMPANY_NAME, "Company Name not present");
assert(config.MONGO_URL, "MongoDB URL not present");
assert(config.MONGO_DBNAME, "MongoDB Database Name not present");
assert(config.EMAIL_OUTGOING_SERVER, "Email Server not present");
assert(config.EMAIL_USERNAME, "Email Username not present");
assert(config.EMAIL_PASSWORD, "Email Password not present");
assert(config.BC_API_KEY, "Email Destination address(es) not present");
assert(config.ENGINEERS, "No Engineers specified");
assert(config.SURVEYORS, "No Surveyors specified");

MongoClient.connect(config.MONGO_URL, { useNewUrlParser: true }, (err, client) => {
    assert.equal(null, err);
    const db = client.db(config.MONGO_DBNAME);
    const https = require('./http')(config, env, port, logger);
    require('./socket')(config, https, logger, db);
    db.collection('jobs').createIndex({ JobId: 1 });
    db.collection('jobs').createIndex({ ContactId: 1 });
    db.collection('jobs').createIndex({ Type: 1 });
    db.collection('jobs').createIndex({ CurrentFlag: 1});
});

process.on('SIGINT', () => {
    logger.info("Shutting down");
});

