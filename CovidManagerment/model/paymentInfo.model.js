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
        let result= 0;
        if(check.rowCount >= 1){
            result = await pool.query(`UPDATE public."Notification" SET info='Mời bạn tiến hành thanh toán số dư nợ.' WHERE "userID"=${userID}`);
        }else{
            result = await pool.query(`INSERT INTO public."Notification"(info, "userID", "userName")
                VALUES ('Mời bạn tiến hành thanh toán số dư nợ.', ${userID}, '${username}');`);
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
    },
    async getPatient(userID){
        let result = await pool.query(`SELECT * FROM public."Patient" WHERE "userID" = ${userID}`);
        if(result.rowCount > 0){
            return result.rows[0];
        }else{
            return 0;
        }
    },
    async addOrder(patientID, totalOrder, orderDate, statusPayment){
        let result = await pool.query(`INSERT INTO public."Order"(
            "patientID", "TotalPrice", "oderDate", "statusPayment")
            VALUES (${patientID}, ${totalOrder}, '${orderDate}', '${statusPayment}');`);
        if(result.rowCount >= 1){
            return 1;
        }else{
            return 0;
        }
    },
    async getOrder(patientID, totalOrder, orderDate, statusPayment){
        let result = await pool.query(`SELECT "orderID", "patientID", "TotalPrice", "oderDate", "statusPayment" 
            FROM public."Order" WHERE "patientID" = ${patientID} AND "TotalPrice" = ${totalOrder} AND "oderDate" = '${orderDate}' AND "statusPayment" = '${statusPayment}'`);
        if(result.rowCount >= 1){
            return result.rows[0];
        }else{
            return 0;
        }
    },
    async addOrderDetail(orderID, packageID, quantity){
        let result = await pool.query(`INSERT INTO public."OrdersDetail"(
            "OrdersID", "PackageID", "Quantity")
            VALUES (${orderID}, ${packageID}, ${quantity})`);
        return result;
    },
    async getOrderDetail(orderID, packageID, quantity){
        let result = await pool.query(`SELECT "OrdersDetailID", "OrdersID", "PackageID", "Quantity"
            FROM public."OrdersDetail" WHERE "OrdersID" = ${orderID} AND "PackageID" = ${packageID} AND "Quantity" = ${quantity}`);
        if(result.rowCount >= 1){
            return result.rows[0];
        }else{
            return 0;
        }
    },
    async addOrderPackageDetail(orderDetailID, productID, quantity, price, unit){
        let result = await pool.query(`INSERT INTO public."OrdersPackageDetail"(
            "OrdersDetailID", "ProductID", "Quantity", "Price", "Unit")
            VALUES (${orderDetailID}, ${productID}, ${quantity}, ${price}, '${unit}')`);
        return result;
    },
    async getLimit(){
        let result = await pool.query(`SELECT "paymentLimitID", value
            FROM public."PaymentLimit";`);
        if(result.rowCount >= 1){
            return result.rows[0];
        }else{
            return 0;
        }
    }
}