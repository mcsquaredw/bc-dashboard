module.exports = (db, logger) => {
    const SQL = require('sql-template-strings');

    async function getSavedResources() {
        db.all(SQL`SELECT * FROM Resources`).then(existingResources => {
            return existingResources;
        }).catch(err => {
            logger.error(`Error occured while retrieving resources: ${err}`);
        })
    }

    return {
        getSavedResources
    }
}



