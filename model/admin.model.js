const pool = require('../utils/database')

module.exports ={
    async getAllAcountManager(){
        let manager = await pool.query(`SELECT * FROM public."User" WHERE permission = 2`);
        if(manager.rowCount >= 1){
            return manager.rows;
        }
        return 0;
    },
    async getHistoryActive(userId){
        let result = await pool.query(`SELECT * FROM public."History" WHERE "userID" = ${userId}`);
        if(result.rowCount >= 0){
            return result.rows;
        }
        return 0;
    },
    async getOneUser(userID){
        let user = await pool.query(`SELECT * FROM public."User" WHERE "userID" = ${userID}`);
        if(user.rowCount = 1){
            return user.rows;
        }
        return 0;
    },
    async updateStatusUser(userID, status){
        let result = await pool.query(`UPDATE public."User" SET "active" = ${status} WHERE "userID" = ${userID}`);
        return result;
    },
    async createAccount(username, password){
        let result = await pool.query(`INSERT INTO public."User"(
            "userName", password, permission, active)
            VALUES ('${username}', '${password}', 2, 1);`);
        
        return result;
    },
    async getListHopital(){
        let result = await pool.query(`SELECT * FROM public."Hopital" ORDER BY "hopitalID" ASC `);
        if(result.rowCount >= 0){
            return result.rows;
        }
        return 0;
    }
}