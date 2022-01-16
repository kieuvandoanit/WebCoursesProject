const pool = require("../utils/database");

module.exports = {
    async getProductPackage() {
        let package = await pool.query(`SELECT * FROM "productPackage"`);
        if (package.rowCount > 1) {
            return package.rows;
        } else {
            return 0;
        }
    },

    async getProductDetails(packageID) {
        let product = await pool.query(`SELECT pp2."productPackageID", pp2."package_Name", pro."ProductID", pro."Product_name", pro."price", pro."Unit"
        FROM "Product" as pro, "Package_Product" as pp1, "productPackage" as pp2
        WHERE pp1."packageID" = pp2."productPackageID" and pp1."productID"=pro."ProductID" and pp2."productPackageID"=${packageID}`)
        if (product.rowCount >= 1) {
            return product.rows;
        } else {
            return 0;
        }
    }
}