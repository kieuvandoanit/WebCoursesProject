const pool = require("../utils/database");

module.exports={
    async login(username, password){
        let user = await pool.query(`SELECT * FROM public."User" WHERE "userName" = '${username}' AND "password" = '${password}'`);
        if(user.rowCount === 1){
            return user.rows[0];
        }
        return 0;
        
    },
    async checkAdmin(){
        let user = await pool.query(`SELECT * FROM public."User" WHERE "userName" = 'admin'`);
        return user;
    },
    async createAdmin(){
        let password = 123;
        let result = await pool.query(`INSERT INTO public."User"(
            "userName", password, permission, active)
            VALUES ('admin', '${password}', 1, 1);`);
        
        return result;
    }
}

