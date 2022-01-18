const { peopleEachState } = require('../controllers/manager.controller');
const pool = require('../utils/database')

module.exports = {
    async getAllPatient() {
        let patients = await pool.query(`SELECT * FROM public."Patient" ORDER BY "PatientID" ASC`);

        if (patients.rowCount >= 1) {
            return patients.rows;
        }
        return 0;
    },
    //Tim kiêm benh nhân có tên như pName
    async getPatient(pName) {
        let patient = await pool.query(`SELECT * FROM public."Patient" WHERE "PatientName" like '%${pName}%'`);

        if (patient.rowCount >= 1) {
            return patient.rows;
        }
        return 0;
    },
    //Câp nhật trạng thái bênh nhân có mã patientID
    async updatePatientStatus(patientID ,status) {
        let patient = await pool.query(`UPDATE public."Patient" set "Status" = '${status}' WHERE "PatientID" = '${patientID}'`);
        if (patient.rowCount >= 1) {
            return patient.rows;
        }
        return 0;
    },
    async getPatientID(userID) {
        let patient = await pool.query(`SELECT "PatientID" FROM public."Patient" WHERE "userID" = '${userID}'`);
        if (patient.rowCount >= 1) {
            return patient.rows;
        }
        return 0;
    },
    //Danh sách nhưng bệnh nhân có liên quan đến bệnh nhân có mã patientID
    async listRefPatientID(patientID) {
        let patient = await pool.query(`SELECT "PatientID" FROM public."Patient" WHERE "patient_ref" = '${patientID}'`);
        
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
        let user = await pool.query(`SELECT * FROM public."Patient" WHERE "userID" = ${userID}`);
        if (user.rowCount = 1) {
            return user.rows;
        }
        return 0;
    },
    async getUserRef(PatientID) {
        let user = await pool.query(`SELECT * FROM public."Patient" WHERE "patient_ref" = ${PatientID}`);
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
    //Lay mã bênh viện có mã bênh nhân là patientID
    async getHopital(patientID) {
        let result = await pool.query(`SELECT "hospitalID" FROM public."Patient" WHERE "PatientID" = ${patientID} `);
        if (result.rowCount >= 0) {
            return result.rows;
        }
        return 0;
    },
    //Thêm lịch sử thay đổi trạng thái
    async addStatusHistoryPatient(status ,patientID, hospitalID, fromDate, endDate) {
        let result = await pool.query(`INSERT INTO public."historyPatient"("status","patientID","hopitalID","fromDate","endDate") VALUES ('${status}','${patientID}','${hospitalID}','${fromDate}','${endDate}')`);
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
            query2 = `INSERT INTO public."User"("userID", "userName", "password", "permission", "active") VALUES('${userID}','${username}','123456', '3', '2')`
        } else {
            query = `INSERT INTO public."Patient"(
                "PatientName", "DOB", "province", "ward", "District","Status","userID","hospitalID","patient_ref","identityCard")
                VALUES ('${PatientName}', ${DOB}, '${province}', '${ward}', '${District}','${Status}','${userID}','${hospitalID}','${patient_ref}','${identityCard}')`
            query2 = `INSERT INTO public."User"("userID","userName", "password", "permission", "active") VALUES('${userID}','${username}','123456', '3', '2')`
        }
        //console.log(patient_ref)
        result = await pool.query(query)
        result2 = await pool.query(query2)
        if (result.rowCount >= 1 && result2.rowCount >= 1) {
            return result.rowCount
        }
        return 0;
    },
    async getNumberPerState() {
        let a = []
        let numberOfF0 = await pool.query(`SELECT count("PatientID") FROM public."Patient" WHERE "Status" = 'F0'`);
        let numberOfF1 = await pool.query(`SELECT count("PatientID") FROM public."Patient" WHERE "Status" = 'F1'`);
        let numberOfF2 = await pool.query(`SELECT count("PatientID") FROM public."Patient" WHERE "Status" = 'F2'`);
        let numberOfF3 = await pool.query(`SELECT count("PatientID") FROM public."Patient" WHERE "Status" = 'F3'`);
        let numberOfF4 = await pool.query(`SELECT count("PatientID") FROM public."Patient" WHERE "Status" = 'F4'`);
        let numberOfFine = await pool.query(`SELECT count("PatientID") FROM public."Patient" WHERE "Status" = 'Khỏi bệnh'`);
        a.push(numberOfF0.rows[0])
        a.push(numberOfF1.rows[0])
        a.push(numberOfF2.rows[0])
        a.push(numberOfF3.rows[0])
        a.push(numberOfF4.rows[0])
        a.push(numberOfFine.rows[0])
        //console.log(a)
        if (a.length >= 1) {
            return a;
        }
        return 0;
    },
    async getNumberChangeState() {
        let a = []
        let numberOfF0 = await pool.query(`SELECT count("historyPatientID") FROM public."historyPatient" WHERE "status" = 'F0'`);
        let numberOfF1 = await pool.query(`SELECT count("historyPatientID") FROM public."historyPatient" WHERE "status" = 'F1'`);
        let numberOfF2 = await pool.query(`SELECT count("historyPatientID") FROM public."historyPatient" WHERE "status" = 'F2'`);
        let numberOfF3 = await pool.query(`SELECT count("historyPatientID") FROM public."historyPatient" WHERE "status" = 'F3'`);
        let numberOfF4 = await pool.query(`SELECT count("historyPatientID") FROM public."historyPatient" WHERE "status" = 'F4'`);
        let numberOfFine = await pool.query(`SELECT count("historyPatientID") FROM public."historyPatient" WHERE "status" = 'Khỏi bệnh'`);
        a.push(numberOfF0.rows[0])
        a.push(numberOfF1.rows[0])
        a.push(numberOfF2.rows[0])
        a.push(numberOfF3.rows[0])
        a.push(numberOfF4.rows[0])
        a.push(numberOfFine.rows[0])

        //console.log(a)
        if (a.length >= 1) {
            return a;
        }
        return 0;
    },
    async sortByYOB() {
        let sort = await pool.query(`select * from "Patient" order by "DOB" asc`);

        if (sort.rowCount >= 1) {
            return sort.rows;
            // console.log(Product)
        }
        return 0;
    },
    async sortByStatus() {
        let sort = await pool.query(`select * from "Patient" order by "Status" asc`);

        if (sort.rowCount >= 1) {
            return sort.rows;
            // console.log(Product)
        }
        return 0;
    },
    async getAllProduct() {
        let Product = await pool.query(`SELECT * FROM public."Product" WHERE "isDelete" = 0`);

        if (Product.rowCount >= 1) {
            return Product.rows;
            // console.log(Product)
        }
        return 0;
    },
    async getAllPackage() {
        let Package = await pool.query(`SELECT * FROM public."productPackage" WHERE "isDelete" = 0`);

        if (Package.rowCount >= 1) {
            return Package.rows;
        }
        return 0;
    },
    async DeleteProduct(ProductID) {
        let result = await pool.query(`UPDATE public."Product" SET "isDelete" = 1 WHERE "ProductID" = ${ProductID}`);
        return result;
    },
    async DeletePackage(productPackageID) {
        let result = await pool.query(`UPDATE public."productPackage" SET "isDelete" = 1 WHERE "productPackageID" = ${productPackageID}`);
        return result;
    },
    // search by name or ID
    async searchedProduct(text) {
        let product = await pool.query(`SELECT * FROM public."Product" WHERE "Product_name" like '%${text}%' or "ProductID" = ${text}`);
        if (product.rowCount >= 1) {
            return product.rows;
        }
        return 0;
    },
    // search theo tên còn chưa load được
    async searchedPackage(text) {
        let Package = await pool.query(`SELECT * FROM public."productPackage" WHERE "package_Name" like '%${text}%' or "productPackageID" = ${text}`);
        if (Package.rowCount >= 1) {
            return Package.rows;
        }
        return 0;
    }
}