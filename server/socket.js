const bigChangeApi = require('../api/big-change');
const moment = require('moment');

module.exports = (https, db, logger) => {
    const io = require('socket.io')(https);
    const localDb = require('../api/local-db')(db, logger);
    const email = require('../api/email')(logger);

    function getResources() {
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
        bigChangeApi.getJobs().then(response => {
            if (response.error) {
                logger.error(`Error getting orders: ${response.error}`);
                io.emit('error', { label: 'Error getting jobs', err: response.error });
            } else {
                response
                    .result
                    .filter(job => job.Type.includes("Remedial") || job.Type.includes("Fitting"))
                    .filter(job => job.Status.includes("issues"))
                    .filter(job => moment(job.PlannedStart).isAfter(moment("21/01/2019", "DD/MM/YYYY")))
                    .map(job => {
                        localDb.isNotified(job.JobId).then(notified => {
                            if (!notified) {
                                bigChangeApi.getWorksheets(job.JobId).then(worksheetData => {
                                    email.sendEmail(
                                        `Job with Issues - ${job.Type} - ${job.Contact} ${job.Postcode}`,
                                        "",
                                        `<b>${job.Type}</b> for <b>${job.Contact}</b> fitted by <b>${job.Resource}</b>
                                        <br />
                                        has been marked as <b>Completed with issues</b>
                                        <br />
                                        Please check the following worksheet data (if available) and take appropriate action:
                                        <br />
                                        <table>
                                        ${ worksheetData.result.length > 0 ?
                                            worksheetData.result
                                                .sort((a, b) => a.QuestionOrder - b.QuestionOrder)
                                                .map(qn =>
                                                    `<tr>
                                                        <td><b>${qn.Question}</b></td>
                                                        <td>${qn.AnswerText}</td>
                                                    </tr>
                                                    `
                                                )
                                                .join('')
                                            :
                                            `<tr><td>No worksheet data available</td></tr>`
                                        }
                                        </table>`
                                    ).then(() => {
                                        localDb.setNotified(job.JobId).catch(err => {
                                            logger.error(`Error setting job as notified: ${err}`);
                                            io.emit('error', { label: "Error setting job as notified", err });
                                        });
                                    }).catch(err => {
                                        logger.error(`Error emailing job details: ${err}`);
                                        io.emit('error', { label: "Error emailing job details", err });
                                    });
                                }).catch(err => {
                                    logger.error(`Error getting worksheets: ${err}`);
                                    socket.emit('error', { label: 'Error getting worksheets', err });

                                    return `<tr><td>Worksheet data error</td></tr>`
                                });
                            }
                        });
                    });

                io.emit('orders', { jobs: response.result });
            }
        }).catch(err => {
            logger.error(`Error getting orders: ${err}`);
            io.emit('error', { label: 'Error getting jobs', err });
        });
    }

    function getFlags() {
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
