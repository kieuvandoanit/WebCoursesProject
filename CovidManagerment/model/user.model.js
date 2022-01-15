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
    }
}