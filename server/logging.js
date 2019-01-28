const log4js = require('log4js');

module.exports = (env) => {
    log4js.configure({
        appenders: {
            server: { type: 'file', filename: `logs/${env}-server.log`, maxLogSize: 10485760, backups: 3, compress: true },
            serverConsole: { type: 'console' }
        },
        categories: {
            default: { 
                appenders: [ 'server', 'serverConsole' ], 
                level: env === "PRODUCTION" ? 'warn' : 'info'
            }
        }
    });

    process.on('SIGINT', () => {
        log4js.shutdown();    
    });

    return log4js.getLogger('server');
};