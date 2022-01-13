const Pool = require('pg').Pool;

const pool = new Pool({
    user: "postgres",
    password: "12345",
    database: "ProjectCovid",
    host: "localhost",
    port: 5432
});

module.exports =pool;