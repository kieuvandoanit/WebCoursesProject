const Pool = require('pg').Pool;

const pool = new Pool({
    user: "postgres",
    password: "giang1712404",
    database: "covidSystem",
    host: "localhost",
    port: 5432
});
// pool.query('SELECT NOW()', (err, res) => {
//     console.log(err, res)
//     console.log("connect oke")
//     pool.end()
// })


module.exports = pool;