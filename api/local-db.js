module.exports = (db, logger) => {
    const SQL = require('sql-template-strings');

    async function updateResources(resources) {
        await db
        .all(SQL`INSERT OR REPLACE 
                 INTO Person (personName, latitude, longitude, speed, registration) 
                 VALUES 
                 ${
                    resources.map(resource => {
                        const { personName, latitude, longitude, speed, registration } = resource;
                        return `( ${personName}, ${latitude}, ${longitude}, ${speed}, ${registration} )`
                    })
                 }`
        );
    }

    return {
        updateResources
    }
}



