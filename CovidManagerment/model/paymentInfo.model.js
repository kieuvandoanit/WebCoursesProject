const pool = require("../utils/database");

module.exports={
    async updateLimit(limit){
        let update = await pool.query(`UPDATE public."PaymentLimit" SET value=${limit} WHERE "paymentLimitID"=1`);
        if(update.rowCount === 1){
            return update.rows[0];
        }
        return 0;  
    },
}