const development = require('./development');
const production = require('./production');
const env = (process.env.NODE_ENV ? process.env.NODE_ENV : "development").trim();

module.exports = {
    vars: env === "production" ? production : development
}