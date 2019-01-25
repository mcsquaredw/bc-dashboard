const sqlite = require('sqlite');

const env = (process.env.NODE_ENV ? process.env.NODE_ENV : "DEVELOPMENT").trim().toUpperCase();
const port = process.env.PORT ? process.env.PORT : 3000;
const logger = require('./logging')(env);
const https = require('./http')(env, port, logger);

sqlite
.open(`./data/${env}-bclocal.sqlite`)
.then(db => {
    if(env === 'PRODUCTION') {
        db.migrate();
    } else {
        db.migrate({force: 'last'});
    }
    logger.info("Database connection established");
    require('./socket')(https, db, logger);

    process.on('SIGINT', () => {
        logger.info("Shutting down");
        db.close();
    });
}).catch(err => {
    logger.error("Cannot connect to local database: ", err);
});

