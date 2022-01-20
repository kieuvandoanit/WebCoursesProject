const pool = require("../utils/database");

module.exports={
    async createUser(username, password){
        let result = await pool.query(`INSERT INTO public."User"(
            "userName", password, permission, "accountBalance")
            VALUES ('${username}', '${password}',2, ${0});`);
        
        return result;
    },
    async beforeChangePassword(userID, password){
        let result = await pool.query(`SELECT "userName"
        FROM public."User" WHERE "userID" = ${userID} AND "password" = '${password}'`);
        return result;
    },
    async changePassword(userID, newPassword){
        let result = await pool.query(`UPDATE public."User"
            SET password= '${newPassword}'
            WHERE "userID"= ${userID}`);

        return result;
    },
    async historyTransactionAll(){
        let result = await pool.query(`SELECT "userName", "accountNumber", "totalPrice", "paymentDate", "paymentFor"
            FROM public."User" a, public."historyPayment" b
            WHERE a."userID" = b."userID"`);
        return result;
    },
    async historyTransaction(accountNumber){
        let result = await pool.query(`SELECT "userName", "accountNumber", "totalPrice", "paymentDate", "paymentFor"
            FROM public."User" a, public."historyPayment" b
            WHERE a."userID" = b."userID" AND a."accountNumber" = ${accountNumber}`);
        return result;
    },
    async updateMoney(userID, money){
        let info = await pool.query(`SELECT * FROM public."User" WHERE "userID" = ${userID}`);
        let moneyAfter = parseInt(money) + parseInt(info.rows[0].accountBalance);
        let result = await pool.query(`UPDATE public."User" SET "accountBalance"= ${moneyAfter} WHERE "userID"= ${userID}`);
        return result;
    },
    async infoUser(userID){
        let info = await pool.query(`SELECT * FROM public."User" WHERE "userID" = ${userID}`);
        return info.rows[0];
    },
    async insertHistory(userID, totalPrice, paymentDate, paymentFor){
        let result = await pool.query(`INSERT INTO public."historyPayment"(
            "userID", "totalPrice", "paymentDate", "paymentFor")
            VALUES (${userID}, ${totalPrice}, '${paymentDate}', '${paymentFor}')`);
        return result;
    },
    async getDebt(){
        let result = await pool.query(`SELECT "userName", "accountBalance", "accountNumber"
        FROM public."User" WHERE "accountBalance" < 0`);
        return result;
    },
    async getOneDebt(username){
        let result = await pool.query(`SELECT "accountBalance", "accountNumber"
        FROM public."User" WHERE "userName" = '${username}'`);
        if(result.rowCount >= 1){
            return result.rows[0];
        }else{
            return 0;
        }
    },
    async getUserByUsername(username){
        let result = await pool.query(`SELECT "userID", "userName", password, permission, "accountBalance", "accountNumber"
            FROM public."User" WHERE "userName" = '${username}'`);
        if(result.rowCount >= 1){
            return result.rows[0];
        }else{
            return 0;
        }
    },
    async getHistoryPaymentOne(userID){
        let result = await pool.query(`SELECT "totalPrice", "paymentDate", "paymentFor"
        FROM public."historyPayment" WHERE "userID" = ${userID}`);
        if(result.rowCount > 0){
            return result.rows;
        }else{
            return 0;
        }
    },
    async getHistoryPayment(){
        let result = await pool.query(`SELECT "totalPrice", "paymentDate", "paymentFor", "userName"
        FROM public."historyPayment" p INNER JOIN public."User" u ON p."userID" = u."userID"`);
        if(result.rowCount > 0){
            return result.rows;
        }else{
            return 0;
        }
    }

}