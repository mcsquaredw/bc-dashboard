const development = require('./development');
const production = require('./production');
const env = (process.env.NODE_ENV ? process.env.NODE_ENV : "DEVELOPMENT").trim();

module.exports = {
    vars: env === "PRODUCTION" ? production : development
}