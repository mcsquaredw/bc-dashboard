const fs = require('fs');
const express = require('express');
const app = express();
const Bundler = require('parcel-bundler');
const https = require('https').createServer({
    key: fs.readFileSync('./certs/localhost+3-key.pem'),
    cert: fs.readFileSync('./certs/localhost+3.pem')
}, app);
const io = require('socket.io')(https);

const port = 3000;
const bigChangeApi = require('./api/big-change');

if (process.env.NODE_ENV === "production") {
    app.use(express.static('dist'));
} else {
    const entryPoint = './src/index.html';
    const bundler = new Bundler(entryPoint, {});
    app.use(bundler.middleware());
}

io.on('connection', function (socket) {
    getFlags();
    getOrders();
    getResources();
    
    socket.on('set-flag', (data) => {
        let { jobId, flagId } = data;

        bigChangeApi.setFlag(jobId, flagId).then(response => {
            getOrders();
        }).catch(err => {
            console.error(err);
        })
    });

    socket.on('get-worksheets', (data) => {
        bigChangeApi.getWorksheets(data.jobId).then(worksheets => {
            socket.emit('worksheets', { worksheets })
        }).catch(err => {
            console.error(err);
        });
    });
});

function getResources() {
    bigChangeApi.getResources().then(resources => {
        io.emit('resources', { resources });
    }).catch(err => {
        console.error(err);
    });
}

function getOrders() {
    bigChangeApi.getJobs().then(jobs => {
        io.emit('orders', { jobs });
    }).catch(err => {
        console.error(err);
    });
}

function getFlags() {
    bigChangeApi.getFlags().then(flags => {
        io.emit('flags', { flags });
    }).catch(err => {
        console.error(err);
    });
}

setInterval(() => {
    getResources();
    getOrders();
}, 120000);

https.listen(port, () => {
    console.log("Listening on port", port);
});