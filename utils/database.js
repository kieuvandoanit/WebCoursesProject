const Pool = require('pg').Pool;

const pool = new Pool({
    user: "postgres",
    password: "giang1712404",
    database: "covidSystem",
    host: "localhost",
    port: 5432
});


module.exports = pool;