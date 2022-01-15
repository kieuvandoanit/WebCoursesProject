const pool = require("../utils/database");

module.exports={
    async login(username, password){
        let user = await pool.query(`SELECT * FROM public."User" WHERE "userName" = '${username}' AND "password" = '${password}'`);
        if(user.rowCount === 1){
            return user.rows[0];
        }
        return 0;
        
    },
}

