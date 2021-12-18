const pool = require('../utils/database')

module.exports ={
    async getAllAcountManager(){
        let manager = await pool.query(`SELECT * FROM public."User" WHERE permission = 2`);
        if(manager.rowCount >= 1){
            return manager.rows;
        }
        return 0;
    }
}