const pool = require("../utils/database");

module.exports={
    async updateLimit(limit){
        let update = await pool.query(`UPDATE public."PaymentLimit" SET value=${limit} WHERE "paymentLimitID"=1`);
        if(update.rowCount === 1){
            return update.rows[0];
        }
        return 0;  
    },
    async getUserByUsername(username){
        let user = await pool.query(`SELECT "userID", "userName", password, permission, active FROM public."User" WHERE "userName" = '${username}'`);
        if(user.rowCount === 1){
            return user.rows[0];
        }else{
            return 0;
        }
    },
    async addNotification(userID, username){
        // kiem tra co record do chua
        let check = await pool.query(`SELECT "notificationID", info FROM public."Notification" WHERE "userID" = ${userID}`);
        // co rui thi update
        if(check.rowCount >= 1){
            let result = await pool.query(`UPDATE public."Notification"
            SET info='Mời bạn tiến hành thanh toán số dư nợ.', 
            WHERE "userID"=${userID}`)
        }else{
            let result = await pool.query(`INSERT INTO public."Notification"(
                info, "userID", "userName")
                VALUES ('Mời bạn tiến hành thanh toán số dư nợ.', ${userID}), '${userName}';`)
        }
        if(result.rowCount === 1){
            return 1;
        }else{
            return 0;
        }
    },
    async getAll(){
        let result = await pool.query(`SELECT "notificationID", info, "userID", "userName" FROM public."Notification";`);
        return result.rows;
    }
}