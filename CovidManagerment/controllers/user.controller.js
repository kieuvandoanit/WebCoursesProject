const userModel = require('../model/user.model'),
    pool = require('../utils/database');

module.exports = {
    accountMain: async (req, res, next) => {
        let userID = req.query.userID,
            user = await userModel.getUser(userID),
            patient = await userModel.getPatient(userID),
            info = req.query.info,
            hospital;
        if (patient) {
            hospital = await userModel.getHospital(patient.hopitalID);
            patientManagement = await userModel.getHistoryPatient(userID);
            patient.DOB = patient.DOB.toISOString().split('T')[0];
        }
        if (!info) {
            res.render("user/userInfo", {
                user: user,
                patient: patient,
                hospital: hospital,
                //balance: balance,
                layout: "user"
            })
        } else if (info === "managedHistory") {
            res.render("user/managedHistory", {
                user: user,
                patient: patient,
                patientManagement: patientManagement,
                layout: "user"
            })
        } else if (info === "kitHistory") {
            res.render("user/kitHistory", {
                user: user,
                patient: patient,
                layout: "user"
            })
        } else if (info === "paymentHistory") {
            res.render("user/paymentHistory", {
                user: user,
                patient: patient,
                //paymentHistory: paymentHistory,
                layout: "user"
            })
        } else if (info === "notification") {
            res.render("user/notification", {
                user: user,
                patient: patient,
                layout: "user"
            })
        }
    },

    updatePassword: async (req, res, next) => {
        user = await userModel.getUser(req.params.id);
        res.render("user/changePassword", {
            user: user,
            layout: "user"
        })
    },

    handleUpdatePassword: async (req, res, next) => {
        let userID = req.params.id,
            user = await userModel.getUser(userID),
            password = user.password,
            oldPassword = req.body.oldPassword,
            newPassword = req.body.newPassword,
            repeatPassword = req.body.repeatPassword;
        if (newPassword === repeatPassword) { // matching password
            if (oldPassword != newPassword) { // repeat password
                if (password === oldPassword) {
                    let result = await pool.query(`UPDATE "User"
                    SET "password"='${newPassword}'
                    WHERE "userID"=${userID}`);
                    res.redirect('/user/userInfo') // send back to changePassword with success message
                } else {
                    res.render(`user/changePassword`, {
                        user: user,
                        layout: "user"
                    }) // Error, wrong old password
                }
            } else {
                res.render(`user/changePassword`, {
                    user: user,
                    layout: "user"
                }) // Error, repeat password
            }
        } else {
            res.render(`user/changePassword`, {
                user: user,
                layout: "user"
            }) // Error, password not matching
        }
    }
}