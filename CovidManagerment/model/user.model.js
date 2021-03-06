const pool = require("../utils/database");

module.exports = {
    async getUser(userID) {
        let user = await pool.query(`SELECT * FROM "User" WHERE "userID"=${userID}`);
        if (user.rowCount === 1) {
            return user.rows[0];
        } else {
            return 0;
        }
    },

    async getPatient(userID) {
        let patient = await pool.query(`SELECT * FROM "Patient" WHERE "userID"=${userID}`);
        if (patient.rowCount === 1) {
            return patient.rows[0];
        } else {
            return 0;
        }
    },

    async getHospital(hospitalID) {
        let hospital = await pool.query(`SELECT * FROM "Hopital" WHERE "hopitalID"=${hospitalID}`);
        if (hospital.rowCount === 1) {
            return hospital.rows[0];
        } else {
            return 0;
        }
    },
    
    async getHistoryPatient(userID){
        let patientManagement = await pool.query(`select pt."PatientName", hp."hopitalID", hp."status", hp."fromDate", hp."endDate"
        from public."Patient" as pt, public."historyPatient" as hp
        where pt."PatientID" = hp."patientID" and pt."userID"=${userID}`);
        if (patientManagement.rowCount >= 1) {
            return patientManagement.rows;
        } else {
            return 0;
        }
    },

    async getKitHistory(userID){
        let history = await pool.query(`select o."orderID", pp."package_Name", od."Quantity", o."TotalPrice", o."oderDate"
        from public."Order" as o, public."Patient" as pa, public."productPackage" as pp, public."OrdersDetail" as od
        where o."patientID"=pa."PatientID" and od."PackageID"=pp."productPackageID" and o."orderID"=od."OrdersID" and pa."userID"=${userID}`);
        if (history.rowCount >=1){
            return history.rows;
        }else{
            return 0;
        }
    },
    async getNotification(userID){
        let noti = await pool.query(`SELECT "notificationID", info, "userID", "userName"
        FROM public."Notification" WHERE "userID" = ${userID}`);
        if(noti.rowCount >= 1){
            return noti.rows[0];
        }else{
            return 0;
        }  
    },
    async deleteNotification(username){
        await pool.query(`DELETE FROM public."Notification"
            WHERE "userName" = '${username}'`);
        return 0;
    }
}