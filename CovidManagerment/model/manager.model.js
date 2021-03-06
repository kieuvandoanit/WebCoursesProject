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
    async statisticsPackageProduct() {
        let numberOfPackage = await pool.query(`SELECT "OrdersDetail"."PackageID", "OrdersDetail"."Quantity"
        FROM public."OrdersDetail" INNER JOIN public."Order"  ON "OrdersDetail"."OrdersID" = "Order"."orderID" `);

        //console.log(numberOfPackage.rows)
        if (numberOfPackage.rowCount >= 1) {
            return numberOfPackage.rows ;
        }
        return 0;
    },
    async statisticsUsedProduct() {
        let numberOfProduct = await pool.query(`select "Product_name", SUM("Quantity") AS "Quantity" from public."OrdersPackageDetail" INNER JOIN public."Product" ON "OrdersPackageDetail"."ProductID" = "Product"."ProductID" GROUP BY "Product_name"`);

        //console.log(numberOfPackage.rows)
        if (numberOfProduct.rowCount >= 1) {
            return numberOfProduct.rows ;
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
        let Product = await pool.query(`SELECT * FROM public."Product" where "isDelete" = '0' order by "ProductID"`);

        if (Product.rowCount >= 1) {
            return Product.rows;
            
        }
        return 0;
    },
    async getProductBy(ProductID) {
        let Product = await pool.query(`SELECT * FROM public."Product" where "ProductID" = '${ProductID}' `);

        if (Product.rowCount >= 1) {
            return Product.rows;
            
        }
        return 0;
    },
    async getAllPackage() {
        let Package = await pool.query(`SELECT * FROM public."productPackage" WHERE "isDelete" = 0 ORDER BY "productPackageID"`);

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
        let product = await pool.query(`SELECT * FROM public."Product"  where "isDelete" = '0' and "Product_name" like '%${text}%'`);
        if (product.rowCount >= 1) {
            return product.rows;
        }
        return 0;
    },
    // search theo tên còn chưa load được
    async searchedPackage(text) {
        let Package = await pool.query(`SELECT * FROM public."productPackage" WHERE "package_Name" like '%${text}%' `);
        if (Package.rowCount >= 1) {
            return Package.rows;
        }
        return 0;
    },

    async orderProductByPriceASC() {
        let Product = await pool.query(`SELECT * FROM public."Product" where "isDelete" = '0' order by Price ASC`);
        if (Product.rowCount >= 1) {
            return Product.rows;
        }
        return 0;
    },
    
    async FilterProductByCategory() {
        let Product = await pool.query(`SELECT * FROM public."Product"  where "isDelete" = '0' order by "Category" ASC`);
        if (Product.rowCount >= 1) {
            return Product.rows;
            // console.log(Product)
        }
        return 0;
    },
    async updateProduct(ProductID, productName, price, Unit, Category, image1, image2, image3) {
        result1 = await pool.query(`UPDATE public."Product" SET "Product_name"='${productName}', "price"=${price}, "Unit"='${Unit}', "Category"='${Category}', "image1" = '${image1}', "image2" = '${image2}', "image3" = '${image3}' WHERE "ProductID"=${ProductID}`);

        if (result1.rowCount >= 1) {
            return result1.rowCount;
        }
        return 0;
    },
    async addProductHandle(productName, price, Unit, Category, image) {
        result = await pool.query(`INSERT INTO public."Product"("Product_name", "price", "Unit","isDelete", "Category","image1","image2","image3") VALUES ('${productName}', '${price}', '${Unit}', '0' ,'${Category}','${image}','','')`);
        
        if (result.rowCount >= 1 ) {
            return result.rows
        }
        return 0;
    },

    //Lấy ID của product có tên là productName
    async getProductIDBy(productName){
        productID = await pool.query(`SELECT ("ProductID") FROM public."Product" where "Product_name" = '${productName}'`)
        //console.log(productID)
        if (productID.rowCount >= 1) {
            return productID.rows
        }
        return 0;
    },

    async addPackage(package_Name, limited_ProductQuantity, limited_PackageQuantity, limited_Time, image) {
        result = await pool.query(`INSERT INTO public."productPackage"("package_Name", "limited_ProductQuantity", "limited_PackageQuantity", "limited_Time","isDelete","image")
            VALUES ('${package_Name}', ${limited_ProductQuantity}, ${limited_PackageQuantity}, ${limited_Time},'0','${image}')`);
        if (result.rowCount >= 1) {
            return result.rowCount
        }
        return 0;
    },
    async updatePackage(PackageID, package_Name, limited_ProductQuantity, limited_PackageQuantity, limited_Time, image) {
        result = await pool.query(`UPDATE  public."productPackage" SET "package_Name"='${package_Name}', "limited_ProductQuantity"= '${limited_ProductQuantity}', "limited_PackageQuantity" = '${limited_PackageQuantity}',  "limited_Time"= '${limited_Time}', "image" = '${image}' WHERE "productPackageID"= '${PackageID}' `);
        if (result.rowCount >= 1) {
            return result.rows
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

    async getNumberProductInPackage(packageID) {
        result = await pool.query(`SELECT sum("number") FROM public."Package_Product" where "Package_Product"."packageID" = '${packageID}'`);
        if (result.rowCount >= 1) {
            return result.rows
        }
        return 0;
    },

    async insertProductIntoPackage(packageID, productID, quantity) {
        result = await pool.query(`INSERT INTO public."Package_Product"("packageID", "productID", "number", "isDelete")
            VALUES ('${packageID}', '${productID}', '${quantity}' , '0');`);
        if (result.rowCount >= 1) {
            return result.rows
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
        let Products = await pool.query(`SELECT * FROM public."Package_Product" INNER JOIN public."Product" ON "Package_Product"."productID" = "Product"."ProductID" WHERE "packageID"='${PackageID}' and  "Product"."isDelete" = 0 ORDER BY "Package_ProductID"`);
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
    },

    async getHospital(){
        let result = await pool.query(`select "hopitalName", "hopitalID" from public."Hopital"`);
        return result;
    },
    async getHospitalNow(patientID){
        let result = await pool.query(`SELECT "PatientName", "DOB", province, ward, "District", "Status", "userID", "hospitalID", patient_ref, "identityCard"
        FROM public."Patient" WHERE "PatientID" = ${patientID}`);
        if(result.rowCount === 1){
            return result.rows[0]
        }
        return 0; 
    },
    async updateHopitalPatient(hopital, patientID){
        let result = await pool.query(`UPDATE public."Patient" SET "hospitalID"=${hopital} WHERE "PatientID"= ${patientID}`);
        if(result.rowCount === 1){
            return 1;
        }
        return 0;
    },
    async getHopital1(hopital){
        let result = await pool.query(`SELECT * FROM public."Hopital" WHERE "hopitalID" = ${hopital}`);
        if(result.rowCount === 1){
            return result.rows[0];
        }
        return 0;
    },
    async updateHospitalQuantity(hopital, number){
        let result = await pool.query(`UPDATE public."Hopital" SET  "current_Quantity"=${number} WHERE "hopitalID"=${hopital}`)
        return result;
    },
    async deleteProductFromPackage(productID, packageID){
        let result = await pool.query(`DELETE FROM public."Package_Product"
        WHERE "productID" = ${productID} AND "packageID"=${packageID}`);
        return result;
    }
}