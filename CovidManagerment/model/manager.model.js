const { addProductHandle } = require('../controllers/manager.controller');
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
    async addUser(username, password){
        query = `INSERT INTO public."User"("userName", "password", "permission", "active") VALUES('${username}','${password}', '3', '1')`;
        result = await pool.query(query)
        return result;
    },
    async getUser(username, password){
        let user = await pool.query(`SELECT * FROM public."User" WHERE "userName" = '${username}' AND "password" = '${password}'`);
        if(user.rowCount === 1){
            return user.rows[0];
        }
        return 0;
    },
    async addPatient(PatientName, DOB, province, ward, District, Status, userID, hospitalID, patient_ref, identityCard, username) {
        let query = ''

        if (patient_ref == -1) {
            query = `INSERT INTO public."Patient"(
                "PatientName", "DOB", "province", "ward", "District","Status","userID","hospitalID","identityCard")
                VALUES('${PatientName}', ${DOB}, '${province}', '${ward}', '${District}','${Status}','${userID}','${hospitalID}','${identityCard}')`
        } else {
            query = `INSERT INTO public."Patient"(
                "PatientName", "DOB", "province", "ward", "District","Status","userID","hospitalID","patient_ref","identityCard")
                VALUES ('${PatientName}', ${DOB}, '${province}', '${ward}', '${District}','${Status}','${userID}','${hospitalID}','${patient_ref}','${identityCard}')`
        }
        result = await pool.query(query)
        if (result.rowCount >= 1) {
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
    },
    async orderProductByPriceASC() {
        let Product = await pool.query(`SELECT * FROM public."Product" where "isDelete"= 0 order by Price ASC`);
        if (Product.rowCount >= 1) {
            return Product.rows;
            // console.log(Product)
        }
        return 0;
    },
    async orderProductByPriceDESC() {
        let Product = await pool.query(`SELECT * FROM public."Product" where "isDelete"= 0 order by Price DESC`);
        if (Product.rowCount >= 1) {
            return Product.rows;
            // console.log(Product)
        }
        return 0;
    },
    async FilterProductByCategory() {
        let Product = await pool.query(`SELECT * FROM public."Product" p where "isDelete"= 0 group by "Category","ProductID"`);
        if (Product.rowCount >= 1) {
            return Product.rows;
            // console.log(Product)
        }
        return 0;
    },
    async updateProduct(ProductID, productName, price, Unit, Category, image) {
        result1 = await pool.query(`UPDATE public."Product" SET "Product_name"='${productName}', "price"=${price}, "Unit"='${Unit}', "Category"='${Category}' WHERE "ProductID"=${ProductID}`);
        currentImage = await pool.query(`select "image_Link" from public."Product" WHERE "ProductID"=${ProductID}`);
        result2 = await pool.query(`UPDATE public."Image" SET "image_Link"='${image}' WHERE "ProductID"=${ProductID} and "image_Link" = '${currentImage}'`);

        if (result1.rowCount >= 1 && result2.rowCount >= 1) {
            return result1.rowCount;
        }
        return 0;
    },
    async addProductHandle(productName, price, Unit, Category, image) {
        result1 = await pool.query(`INSERT INTO public."Product"("Product_name", "price", "Unit", "Category")
            VALUES ('${productName}', ${price}, '${Unit}', '${Category}')`);
        ProductID = await pool.query(`SELECT max("ProductID") FROM public."Product"`)
        result2 = await pool.query(`INSERT INTO public."Image" ("image_Link", "ProductID") 
            VALUES('${image}', ${ProductID})`);
        if (result1.rowCount >= 1 && result2.rowCount >= 1) {
            return result1.rowCount
        }
        return 0;
    },
    async addPackage(package_Name, limited_ProductQuantity, limited_PackageQuantity, limited_Time) {
        result = await pool.query(`INSERT INTO public."productPackage"("package_Name", "limited_ProductQuantity", "limited_PackageQuantity", "limited_Time")
            VALUES ('${package_Name}', ${limited_ProductQuantity}, ${limited_ProductQuantity}, ${limited_Time})`);
        if (result.rowCount >= 1) {
            return result.rowCount
        }
        return 0;
    },
    async updatePackage(productPackageID, package_Name, limited_ProductQuantity, limited_PackageQuantity, limited_Time) {
        result = await pool.query(`UPDATE  public."productPackage" SET "package_Name"='${package_Name}', "limited_ProductQuantity"=${limited_ProductQuantity}, "limited_PackageQuantity" = ${limited_PackageQuantity},  "limited_Time"= ${limited_Time} WHERE "productPackageID"=${productPackageID} `);
        if (result.rowCount >= 1) {
            return result.rowCount
        }
        return 0;
    },
    async addProductToPackage(productPackageID, ProductID, number) {
        result = await pool.query(`INSERT INTO public."Package_Product"("packageID", "productID", "number")
            VALUES (${productPackageID}, ${ProductID}, ${number})`);
        if (result.rowCount >= 1) {
            return result.rowCount
        }
        return 0;
    },
    async DeleteProductOutPackage(product_PackageID) {
        result = await pool.query(`UPDATE public."Package_Product" SET "IsDelete"=1 where "Package_ProductID"= ${product_PackageID}`);
        if (result.rowCount >= 1) {
            return result.rowCount
        }
        return 0;
    },
    async UpdateProductOfPackage(productPackageID, ProductID, number) {
        result = await pool.query(`UPDATE public."Package_Product" SET "number"=${number} where "packageID"= ${productPackageID} and "productID"=${ProductID}`);
        if (result.rowCount >= 1) {
            return result.rowCount
        }
        return 0;
    },
    async getOnePackage(PackageID) {
        let Package = await pool.query(`SELECT * FROM public."productPackage" WHERE "productPackageID"=${PackageID}`);
        if (Package.rowCount >= 1) {
            return Package.rows;
        }
        return 0;
    },
    async getListProductOfOnePackage(PackageID) {
        let Products = await pool.query(`SELECT * FROM public."Package_Product" WHERE "Package_ProductID"=${PackageID} and "IsDelete" = 0`);
        if (Products.rowCount >= 1) {
            return Products.rows;
        }
        return 0;
    },

    async getOneProduct(ProductID) {
        let Product = await pool.query(`SELECT * FROM public."Product" WHERE "ProductID"=${ProductID}`);
        if (Product.rowCount >= 1) {
            return Product.rows;
        }
        return 0;
    },
    async getOneImageOfProduct(ProductID) {
        let Image = await pool.query(`SELECT * FROM public."Image" WHERE "ProductID"=${ProductID}`);
        if (Image.rowCount >= 1) {
            return Image.rows;
        }
        return 0;
    }
}