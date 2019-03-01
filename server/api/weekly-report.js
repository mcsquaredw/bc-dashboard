const moment = require('moment');

module.exports = (config, logger, db) => {
    const email = require('../api/email')(config, logger);

    function processWeeklyReports() {
        db.collection('jobs').find({}).toArray().then(results => {
            const problemJobs = results
            .filter(job => job.RealEnd)
            .filter(job => moment(job.RealStart).set('hours', 0).isAfter(moment().add(-7, 'days')))
            .filter(job => job.Type.includes("Remedial") && job.Type.includes("Warranty") || (job.Type.includes("Fitting") && job.Status.includes("issues")));
            const contactIds = new Set(problemJobs.map(job => job.ContactId ));
            const jobGroups = Promise.all(
                Array.from(contactIds).map(async contactId => {
                    return { ContactId: contactId, Jobs: await db.collection('jobs').find({ContactId: contactId}).toArray()}; 
                })
            ).then(results => {
                console.log(results);
            }).catch(err => {
                console.log(err);
            });
        }).catch(err => {
            console.log(err);
        });
    }

    return {
        processWeeklyReports
    }
}