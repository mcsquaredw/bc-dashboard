const fs = require('fs');
const express = require('express');
const Bundler = require('parcel-bundler');
const app = express();

const now = new Date();

module.exports = (config, env, port, logger) => {
    const { KEY, CERT } = config;
    const https = require('https').Server({
        key: fs.readFileSync(__dirname + `/certs/${KEY}`),
        cert: fs.readFileSync(__dirname + `/certs/${CERT}`)
    }, app);

    if (env === "production") {
        logger.info(`Starting in PRODUCTION mode at ${now}`);
    
        app.use(express.static('dist'));
    } else {
        const entryPoint = './client/index.html';
        const bundler = new Bundler(entryPoint, {});
    
        logger.info(`Starting in DEVELOPMENT mode at ${now}`);
        app.use(bundler.middleware());
    }

    https.listen(port, () => {
        logger.info(`Listening on Port ${port}`);
    });

    return https;
}