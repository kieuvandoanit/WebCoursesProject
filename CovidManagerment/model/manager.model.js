const pool = require('../utils/database')

module.exports = {
    async getAllPatient() {
        let patients = await pool.query(`SELECT * FROM public."Patient"`);

        if (patients.rowCount >= 1) {
            return patients.rows;
        }
        return 0;
    },
    async getPatient(pName) {
        let patient = await pool.query(`SELECT * FROM public."Patient" WHERE "PatientName" like '%${pName}%'`);

        if (patient.rowCount >= 1) {
            return patient.rows;
        }
        return 0;
    },
    async getHistoryActive(userId) {
        let result = await pool.query(`SELECT * FROM public."History" WHERE "userID" = ${userId}`);
        if (result.rowCount >= 0) {
            return result.rows;
        }
        return 0;
    },
    async getOneUser(userID) {
        let user = await pool.query(`SELECT * FROM public."User" WHERE "userID" = ${userID}`);
        if (user.rowCount = 1) {
            return user.rows;
        }
        return 0;
    },
    async updateStatusUser(userID, status) {
        let result = await pool.query(`UPDATE public."User" SET "active" = ${status} WHERE "userID" = ${userID}`);
        return result;
    },
    async createAccount(username, password) {
        let result = await pool.query(`INSERT INTO public."User"(
            "userName", password, permission, active)
            VALUES ('${username}', '${password}', 2, 1);`);

        return result;
    },
    async getListHopital() {
        let result = await pool.query(`SELECT * FROM public."Hopital" ORDER BY "hopitalID" ASC `);
        if (result.rowCount >= 0) {
            return result.rows;
        }
        return 0;
    },
    async getHopitalInfo(hopitalID) {
        let result = await pool.query(`SELECT * FROM public."Hopital" WHERE "hopitalID" = ${hopitalID}`);
        if (result.rowCount >= 0) {
            return result.rows;
        }
        return 0;
    },
    async updateHopital(hopitalId, hopitalName, currentQuantity, capacity, province, district, ward) {
        result = await pool.query(`UPDATE public."Hopital" SET "hopitalName"='${hopitalName}', "current_Quantity"=${currentQuantity}, "Capacity"=${capacity}, province='${province}', ward='${ward}', "District"='${district}' WHERE "hopitalID"=${hopitalId}`);
        if (result.rowCount >= 1) {
            return result.rowCount;
        }
        return 0;
    },
    async addPatient(PatientName, DOB, province, ward, District, Status, userID, hospitalID, patient_ref, identityCard, username) {
        let query = ''

        if (patient_ref == -1) {
            query = `INSERT INTO public."Patient"(
                "PatientName", "DOB", "province", "ward", "District","Status","userID","hospitalID","identityCard")
                VALUES('${PatientName}', ${DOB}, '${province}', '${ward}', '${District}','${Status}','${userID}','${hospitalID}','${identityCard}')`
            query2 = `INSERT INTO public."User"(
                "userName", "password", "permission", "active") VALUES('${username}','123456', '3', '2')`
        } else {
            query = `INSERT INTO public."Patient"(
                "PatientName", "DOB", "province", "ward", "District","Status","userID","hospitalID","patient_ref","identityCard")
                VALUES ('${PatientName}', ${DOB}, '${province}', '${ward}', '${District}','${Status}','${userID}','${hospitalID}','${patient_ref}','${identityCard}')`
            query2 = `INSERT INTO public."User"("userName", "password", "permission", "active") VALUES('${username}','123456', '3', '2')`
        }
        console.log(patient_ref)
        result = await pool.query(query)
        result2 = await pool.query(query2)
        if (result.rowCount >= 1 && result2.rowCount >= 1) {
            return result.rowCount
        }
        return 0;
    },
    async getAllProduct() {
        let Product = await pool.query(`SELECT * FROM public."Product"`);

        if (Product.rowCount >= 1) {
            return Product.rows;
            // console.log(Product)
        }
        return 0;
    },
    async getAllPackage() {
        let Package = await pool.query(`SELECT * FROM public."productPackage"`);

        if (Package.rowCount >= 1) {
            return Package.rows;
        }
        return 0;
    }

}