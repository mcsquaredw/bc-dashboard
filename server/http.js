const fs = require('fs');
const express = require('express');
const Bundler = require('parcel-bundler');
const bodyParser = require('body-parser');

const app = express();

module.exports = (config, env, port, logger) => {
    const { KEY, CERT } = config;
    const https = require('https').Server({
        key: fs.readFileSync(__dirname + `/certs/${KEY}`),
        cert: fs.readFileSync(__dirname + `/certs/${CERT}`)
    }, app);

    if (env === "production") {
        logger.info(`Starting in production mode`);
    
        app.use(express.static('dist'));
    } else {
        const entryPoint = './client/index.html';
        const bundler = new Bundler(entryPoint, {});
    
        logger.info(`Starting in development mode`);
        app.use(bundler.middleware());
    }

    app.use(bodyParser.json());

    https.listen(port, () => {
        logger.info(`Listening on Port ${port}`);
    });

    return https;
}