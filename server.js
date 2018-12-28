const express = require('express');
const app = express();
const Bundler = require('parcel-bundler');
const http = require('http').Server(app);
const io = require('socket.io')(http);

const port = 3000;
const bigChangeApi = require('./api/big-change');
const entryPoint = './src/index.html';
const bundler = new Bundler(entryPoint, {});

if (process.env.NODE_ENV === "production") {
    app.use(express.static('dist'));
} else {
    app.use(bundler.middleware());
}

app.get("/", (req, res) => {
    res.redirect("./index.html");
});

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

http.listen(port, () => {
    console.log("Listening on port", port);
});