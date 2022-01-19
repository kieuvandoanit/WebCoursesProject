const Pool = require('pg').Pool;

const pool = new Pool({
    user: "postgres",

    //     password: "giang1712404",
    //     database: "covidSystem",
    // password: "postgres",
    // database: "ProjectCovid",

    // password: "giang1712404",
    // database: "covidSystem",


    password: "123456",
    database: "PCCovid",

    //password: "123456",
    //database: "ProjectCovid",

    // password: "123456",
    // database: "PCovid",

    host: "localhost",
    port: 5432
});


module.exports = pool;