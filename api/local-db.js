const sqlite = require('sqlite');
const SQL = require('sql-template-strings');

sqlite.open(__dirname + '/../data/bclocal.sqlite', { cached: true }).then(db => {
    db.migrate({force: 'last'});

    
}).catch(err => {
    console.log(err);
});