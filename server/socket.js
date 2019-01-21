module.exports = (https, db, logger) => {
    const bigChangeApi = require('../api/big-change');
    const io = require('socket.io')(https);
    const localDb = require('../api/local-db')(db, logger);

    function getResources() {
        bigChangeApi.getResources().then(response => {
            localDb.getSavedResources().then(savedResources => {
                console.log(savedResources, response.data.Result);

                io.emit('resources', { resources: response.data.Result });
            }).catch(err => {
                logger.error(`Error getting local resources: ${err}`);
                io.emit('error', { label: 'Error getting resources', detail: err });
            });
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

    setInterval(() => {
        logger.info(`Updating clients with new data`);
        getResources();
        getOrders();
    }, 120000);

    return {
        getResources,
        getJobs,
        getFlags
    }
}
