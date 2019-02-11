module.exports = (config, https, logger, db) => {
    const { ENGINEERS, SURVEYORS } = config;
    const io = require('socket.io')(https);
    const notifications = require('./api/notifications')(config, logger, db);
    const reports = require('./api/reports')(config, logger, db);
    const bigChangeApi = require('./api/big-change')(config, logger);

    function getResources() {
        logger.info("----- BEGIN RESOURCE UPDATE -----");
        bigChangeApi.getResources().then(response => {
            if (response.error) {
                logger.error(`Error getting resources from Big Change: ${err}`);
                io.emit('error', { label: `Error getting resources from Big Change`, err: response.error });
            } else {
                io.emit('resources', {
                    resources: response.result.map(resource => {
                        return {
                            ...resource,
                            isEngineer: ENGINEERS.includes(resource.ResourceName),
                            isSurveyor: SURVEYORS.includes(resource.ResourceName)
                        }
                    })
                });
            }
        }).catch(err => {
            logger.error(`Error getting resources: ${err}`);
            io.emit('error', { label: `Error getting resources`, err });
        });
    }

    async function getOrders() {
        logger.info("----- BEGIN ORDER UPDATE -----");
        const newJobs = (await bigChangeApi.getOrders()).result;
        let writes = [];

        Promise.all(
            newJobs
            .filter(newJob => newJob.RealEnd)
            .map(async(finishedJob) => {
                const savedJob = await db.collection('jobs').findOne({ JobId: finishedJob.JobId }, { JobId: 1});
                
                if(!savedJob) {
                    const jobDetails = (await bigChangeApi.getOneJob(finishedJob.JobId)).result;
                    const worksheets = (await bigChangeApi.getWorksheets(finishedJob.JobId)).result;

                    writes.push(
                        { insertOne: {
                                ...jobDetails,
                                worksheets
                            } 
                        }
                    )
                }
                
            })
        ).then(() => {
            if(writes.length > 0) {
                db.collection('jobs').bulkWrite(writes);
            }
            
            io.emit('orders', {jobs: newJobs});
            notifications.processNotifications(newJobs);
            reports.processReports(newJobs);
        }).catch(err => {
            logger.error(err);
        });
    }

    function getFlags() {
        logger.info("----- BEGIN FLAG UPDATE -----");
        bigChangeApi.getFlags().then(response => {
            if (response.error) {
                logger.error(`Error getting flags from Big Change: ${response.error}`);
                io.emit('error', { label: 'Error getting flags from Big Change', err: response.error });
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

            db.collection("jobs").findOne({ JobId: data.jobId }).then(job => {
                if (job) {
                    logger.info("Found saved worksheets in local DB");
                    socket.emit('worksheets', { worksheets: job.worksheets });
                } else {
                    bigChangeApi.getWorksheets(data.jobId).then(response => {
                        socket.emit('worksheets', { worksheets: response.result });
                    }).catch(err => {
                        logger.error(`Error getting worksheets: ${err}`);
                        socket.emit('error', { label: 'Error getting worksheets', err });
                    });
                }
            }).catch(err => {
                logger.error(`Error getting worksheets: ${err}`);
                socket.emit('error', { label: 'Error getting worksheets', err });
            })
        });
    });

    setInterval(() => {
        logger.info(`Updating clients with new data`);
        getResources();
        getOrders();
    }, 120000);
}
