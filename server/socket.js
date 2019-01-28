module.exports = (https, db, logger) => {
    const io = require('socket.io')(https);
    const notifications = require('./api/notifications')(db, logger);
    const reports = require('./api/reports')(db, logger);
    const bigChangeApi = require('./api/big-change')(logger);

    function getResources() {
        logger.info("----- BEGIN RESOURCE UPDATE -----");
        bigChangeApi.getResources().then(response => {
            if (response.error) {
                logger.error(`Error getting resources: ${err}`);
                io.emit('error', { label: `Error getting resources`, err: response.error });
            } else {
                io.emit('resources', { resources: response.result });
            }
        }).catch(err => {
            logger.error(`Error getting resources: ${err}`);
            io.emit('error', { label: `Error getting resources`, err });
        });
    }

    function getOrders() {
        logger.info("----- BEGIN ORDER UPDATE -----");
        bigChangeApi.getOrders().then(response => {
            if (response.error) {
                logger.error(`Error getting orders: ${response.error}`);
                io.emit('error', { label: 'Error getting jobs', err: response.error });
            } else {
                notifications.processNotifications(response.result);
                reports.processReports(response.result);

                io.emit('orders', { jobs: response.result });
            }
        }).catch(err => {
            logger.error(`Error getting orders: ${err}`);
            io.emit('error', { label: 'Error getting jobs', err });
        });
    }

    function getFlags() {
        logger.info("----- BEGIN FLAG UPDATE -----");
        bigChangeApi.getFlags().then(response => {
            if (response.error) {
                logger.error(`Error getting flags: ${response.error}`);
                io.emit('error', { label: 'Error getting flags', err: response.error });
            } else {
                io.emit('flags', { flags: response.result });
            }
        }).catch(err => {
            logger.error(`Error getting flags: ${err}`);
            io.emit('error', { label: 'Error getting flags', err });
        });
    }

    io.on('connection', function (socket) {
        logger.info(`Connection received from client`);
        getFlags();
        getOrders();
        getResources();

        socket.on('set-flag', (data) => {
            let { jobid, flagid } = data;

            logger.info(`Received set-flag message for job ID ${data.jobid} and flag ID ${data.flagid}`);

            bigChangeApi.setFlag(jobid, flagid).then(response => {
                logger.info(`Response received: ${response.result}`);
                getOrders();
            }).catch(err => {
                logger.error(`Error setting flag: ${err}`);
                socket.emit('error', { label: 'Error setting label', err: response.error });
            })
        });

        socket.on('get-worksheets', (data) => {
            logger.info(`Received get-worksheets message for job ID ${data.jobId}`);

            bigChangeApi.getWorksheets(data.jobId).then(response => {
                socket.emit('worksheets', { worksheets: response.result });
            }).catch(err => {
                logger.error(`Error getting worksheets: ${err}`);
                socket.emit('error', { label: 'Error getting worksheets', err });
            });
        });
    });

    setInterval(() => {
        logger.info(`Updating clients with new data`);
        getResources();
        getOrders();
    }, 120000);

    return {
        getResources,
        getOrders,
        getFlags
    }
}
