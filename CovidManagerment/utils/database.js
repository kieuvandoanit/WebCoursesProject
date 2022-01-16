const Pool = require('pg').Pool;

const pool = new Pool({
    user: "postgres",

    // password: "giang1712404",
    // database: "covidSystem",
    password: "doan1999",
    database: "test1",
    host: "localhost",
    port: 5432
});


module.exports = pool;