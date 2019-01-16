const fs = require('fs');
const express = require('express');
const app = express();
const Bundler = require('parcel-bundler');
const env = (process.env.NODE_ENV ? process.env.NODE_ENV : "development").trim();
const https = require('https').createServer({
    key: fs.readFileSync('./certs/localhost+3-key.pem'),
    cert: fs.readFileSync('./certs/localhost+3.pem'),
    requestCert: false, 
    rejectUnauthorized: false
}, app);
const io = require('socket.io')(https);
const log4js = require('log4js');
const now = new Date();

log4js.configure({
    appenders: {
        server: { type: 'file', filename: `logs/${env}-server.log`, maxLogSize: 10485760, backups: 3, compress: true }
    },
    categories: {
        default: { appenders: [ 'server'], level: 'debug'}
    }
});

const port = 3000;
const bigChangeApi = require('./api/big-change');
const logger = log4js.getLogger('server');

if (env === "production") {
    logger.info(`Starting in PRODUCTION mode at ${now}`);

    app.use(express.static('dist'));
} else {
    const entryPoint = './src/index.html';
    const bundler = new Bundler(entryPoint, {});

    logger.info(`Starting in DEVELOPMENT mode at ${now}`);
    app.use(bundler.middleware());
}

io.on('connection', function (socket) {
    logger.info(`Connection received from client`);
    getFlags();
    getOrders();
    getResources();
    
    socket.on('set-flag', (data) => {
        let { jobid, flagid } = data;

        logger.info(`Received set-flag message for job ID ${ data.jobid } and flag ID ${ data.flagid }`);

        bigChangeApi.setFlag(jobid, flagid).then(response => {
            logger.info(`Response received: ${response.data.Result}`);
            getOrders();
        }).catch(err => {
            logger.error(`Error setting flag: ${err}`);
            socket.emit('error', { label: 'Error setting label', detail: err });
        })
    });

    socket.on('get-worksheets', (data) => {
        logger.info(`Received get-worksheets message for job ID ${ data.jobId }`);

        bigChangeApi.getWorksheets(data.jobId).then(response => {
            logger.info(`Response received: ${response}`);
            socket.emit('worksheets', { worksheets: response.data.Result });
        }).catch(err => {
            logger.error(`Error getting worksheets: ${err}`);
            socket.emit('error', { label: 'Error getting worksheets', detail: err });
        });
    });
});

function getResources() {
    bigChangeApi.getResources().then(response => {
        io.emit('resources', { resources: response.data.Result });
    }).catch(err => {
        logger.error(`Error getting resources: ${err}`);
        io.emit('error', { label: 'Error getting resources', detail: err });
    });
}

function getOrders() {
    bigChangeApi.getJobs().then(response => {
        io.emit('orders', { jobs: response.data.Result });
    }).catch(err => {
        logger.error(`Error getting orders: ${err}`);
        io.emit('error', { label: 'Error getting jobs', detail: err });
    });
}

function getFlags() {
    bigChangeApi.getFlags().then(response => {
        io.emit('flags', { flags: response.data.Result });
    }).catch(err => {
        logger.error(`Error getting flags: ${err}`);
        io.emit('error', { label: 'Error getting flags', detail: err });
    });
}

setInterval(() => {
    logger.info(`Updating clients with new data`);
    getResources();
    getOrders();
}, 120000);

https.listen(port, () => {
    logger.info(`Listening on Port ${port}`);
});