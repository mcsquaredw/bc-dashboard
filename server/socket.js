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
                io.emit('resources', { resources: response.result.map(resource => {
                    return { ...resource, 
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

    function getOrders() {
        logger.info("----- BEGIN ORDER UPDATE -----");
        bigChangeApi.getOrders().then(response => {
            if (response.error) {
                logger.error(`Error getting jobs from Big Change: ${response.error}`);
                io.emit('error', { label: 'Error getting jobs from Big Change', err: response.error });
            } else {
                const jobs = response.result;

                Promise.all(
                    jobs
                    .filter(job => job.RealEnd)
                    .filter(async(job) => !await db.collection('jobs').find({ JobId: job.JobId }))
                    .map(async(job) => {
                        try {
                            const jobDetails = await bigChangeApi.getOneJob(job.JobId);
                            const worksheets = await bigChangeApi.getWorksheets(job.JobId);

                            return await db.collection('jobs').insertOne(
                                {
                                    ...jobDetails.result,
                                    worksheets: worksheets.result
                                }
                            )
                        } catch(err) {
                            logger.error(`${err}`);
                        } 
                    })
                );
                
                notifications.processNotifications(jobs);
                reports.processReports(jobs);
                
                io.emit('orders', { jobs });
            }
        }).catch(err => {
            logger.error(`Error getting jobs: ${err}`);
            io.emit('error', { label: 'Error getting jobs', err });
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

            db.collection("jobs").findOne({ JobId: data.jobId}).then(job => {
                if(job) {
                    logger.info("Found saved worksheets in local DB");
                    socket.emit('worksheets', { worksheets: job.worksheets });
                } else {
                    bigChangeApi.getWorksheets(data.jobId).then(response => {
                        logger.info("Retrieved worksheets from Big Change");

                        job.worksheets = response.result;
                        
                        db.collection("jobs").update({JobId: job.JobId}, job).catch(err => {
                            logger.error("Worksheet data not saved!");
                        });

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

    return {
        getResources,
        getOrders,
        getFlags
    }
}
