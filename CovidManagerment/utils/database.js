const Pool = require('pg').Pool;

const pool = new Pool({
    user: "postgres",

    //     password: "giang1712404",
    //     database: "covidSystem",
    // password: "postgres",
    // database: "WebProject_covidManagement",
    // password: "giang1712404",
    // database: "covidSystem",

    password: "doan1999",
    database: "test1",

    //password: "123456",
    //database: "ProjectCovid",
    host: "localhost",
    port: 5432
});


module.exports = pool;