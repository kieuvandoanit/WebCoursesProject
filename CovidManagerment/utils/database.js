const Pool = require('pg').Pool;

const pool = new Pool({
    user: "postgres",

    //     password: "giang1712404",
    //     database: "covidSystem",
    password: "postgres",
    database: "WebProject_covidManagement",
    host: "localhost",
    port: 5432
});


module.exports = pool;