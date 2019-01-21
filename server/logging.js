const log4js = require('log4js');

module.exports = (env) => {
    log4js.configure({
        appenders: {
            server: { type: 'file', filename: `logs/${env}-server.log`, maxLogSize: 10485760, backups: 3, compress: true }
        },
        categories: {
            default: { appenders: [ 'server'], level: 'debug'}
        }
    });

    return log4js.getLogger('server');
};