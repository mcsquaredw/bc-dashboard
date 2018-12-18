const express = require('express') ;
const app = express();
const Bundler = require('parcel-bundler');
const http = require('http').Server(app);
const io = require('socket.io')(http);

const port = 3000;
const bigChangeApi = require('./api/big-change');
const entryPoint = './src/*.html';
const bundler = new Bundler(entryPoint, {});

if(process.env.NODE_ENV === "production") {
    app.use(express.static('dist'));
} else {
    app.use(bundler.middleware());
}

app.get("/", (req, res) => {
    res.redirect("./dashboard-engineers.html");
});

io.on('connection', function(socket) {
    getDashboardData();
    getOrderStatus();

    socket.on('get-sales', () => {
        bigChangeApi.getJobs().then(jobs => {
            socket.emit('sales', {jobs});
        }).catch(err => {
            console.error(err);
        })
    });

    socket.on('set-flag', (data) => {
        let { jobId, flagId } = data;

        console.log(jobId, flagId);
        
        bigChangeApi.setFlag(jobId, flagId).then(response => {
            console.log(jobId, flagId);
            getOrderStatus();
        }).catch(err => {
            console.error(err);
        })
    });
});

function getDashboardData() {
    bigChangeApi.getJobs().then(jobs => {
        bigChangeApi.getResources().then(resources => {
            console.log('New Data Requested');
            io.emit('dashboard-data', {jobs, resources});
        });
    }).catch(err => {
        console.error(err);
    });
}

function getOrderStatus() {
    bigChangeApi.getJobs().then(jobs => {
        bigChangeApi.getFlags().then(flags => {
            io.emit('order-status', {jobs, flags});
        });
    }).catch(err => {
        console.error(err);
    });
}

setInterval(() => {
    getDashboardData();
    getOrderStatus();
}, 120000);

http.listen(port, () => {
    console.log("Listening on port", port);
});