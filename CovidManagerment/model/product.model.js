const pool = require("../utils/database");

module.exports = {
    async getProductPackage() {
        let package = await pool.query(`SELECT * FROM "productPackage"`);
        if (package.rowCount > 1) {
            return package.rows;
        } else {
            return 0;
        }
    }
}