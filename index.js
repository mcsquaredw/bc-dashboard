const sqlite = require('sqlite');

const env = (process.env.NODE_ENV ? process.env.NODE_ENV : "DEVELOPMENT").trim();
const port = process.env.PORT ? process.env.PORT : 3000;
const logger = require('./server/logging')(env);
const https = require('./server/http')(env, port, logger);

sqlite.open(`./data/${env}-bclocal.sqlite`).then(db => {
    logger.info("Database connection established");
    require('./server/socket')(https, db, logger);

    process.on('SIGINT', () => {
        logger.info("Shutting down");
        db.close();
    });
}).catch(err => {
    logger.error("Cannot connect to local database: ", err);
});

