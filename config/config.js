const development = require('./development');
const production = require('./production');

module.exports = {
    vars: (("" + process.env.NODE_ENV).includes("PRODUCTION")  ? production : development)
}