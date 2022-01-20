const userModel = require('../model/user.model');
const pool = require('../utils/database');
const axios = require('axios');
const https = require('https');
const jwt = require('jsonwebtoken');
const md5 = require('md5')

module.exports = {
    accountMain: async (req, res, next) => {
        let userID = req.session.user.userID;
        let user = await userModel.getUser(userID);
        let patient = await userModel.getPatient(userID);
        let notificationTemp = await userModel.getNotification(userID);
        let notification;
        if(notificationTemp != 0){
            notification = notificationTemp.info;
        }else{
            notification = "Không có thông báo!"
        }
        let info = req.query.info;
        let hospital;

        if (patient) {
            hospital = await userModel.getHospital(patient.hospitalID);
            patientManagement = await userModel.getHistoryPatient(userID);
            kitHistory = await userModel.getKitHistory(userID);
        }
        if (!info) {
            res.render("user/userInfo", {
                user: user,
                patient: patient,
                hospital: hospital,
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
                kitHistory: kitHistory,
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
                notification: notification,
                layout: "user"
            })
        }
    },
    notification: async (req, res, next) => {
        let userID = req.session.user.userID;
        let user = await userModel.getUser(userID);
        let patient = await userModel.getPatient(userID);
        let notificationTemp = await userModel.getNotification(userID);
        let notification;
        if(notificationTemp != 0){
            notification = notificationTemp.info;
        }else{
            notification = "Không có thông báo!"
        }
        res.render("user/notification", {
            user: user,
            patient: patient,
            notification: notification,
            layout: "user"
        })
    },
    managedHistory: async (req, res, next) => {
        let userID = req.session.user.userID;
        let user = await userModel.getUser(userID);
        let patient = await userModel.getPatient(userID);
        if (patient) {
            patientManagement = await userModel.getHistoryPatient(userID);  
        }
        res.render("user/managedHistory", {
            user: user,
            patient: patient,
            patientManagement: patientManagement,
            layout: "user"
        })
    },
    kitHistory: async (req, res, next) => {
        let userID = req.session.user.userID;
        let user = await userModel.getUser(userID);
        let patient = await userModel.getPatient(userID);
        kitHistory = await userModel.getKitHistory(userID);
        res.render("user/kitHistory", {
            user: user,
            patient: patient,
            kitHistory: kitHistory,
            layout: "user"
        })
    },
    updatePassword: async (req, res, next) => {
        let userID = req.session.user.userID;
        user = await userModel.getUser(userID);
        res.render("user/changePassword", {
            user: user,
            layout: "user"
        })
    },

    handleUpdatePassword: async (req, res, next) => {
        let userID = req.session.user.userID,
            user = await userModel.getUser(userID),
            password = user.password,
            oldPassword = req.body.oldPassword,
            newPassword = req.body.newPassword,
            repeatPassword = req.body.repeatPassword;
            // res.send({password})
        if (newPassword === repeatPassword) { // matching password
            if (oldPassword != newPassword) { // repeat password
                
                if (password == md5(oldPassword)) {
                    // res.send("test")
                    let passwordHash = md5(newPassword);
                    let result = await pool.query(`UPDATE "User"
                    SET "password"='${passwordHash}'
                    WHERE "userID"=${userID}`);
                    res.redirect(`/user/userInfo?userID=${userID}`) // send back to changePassword with success message
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
    },
    viewDebt: async (req, res, next) => {
        let username = req.session.user.username;
        const agent = new https.Agent({  
            rejectUnauthorized: false
          });
        let getDebt = await axios.get(`https://localhost:3443/api/getDebtOne/${username}`,{
            httpsAgent: agent
        });
        let info = "";
        let debt = getDebt.data.accountBalance;
        if(debt < 0){
            info = "Tài khoản đang nợ: ";
            debt = -debt;
        }else{
            info = "Tài khoản đang dư: ";
        }
        res.render('user/debt',{
            layout: 'user',
            username: username,
            debt: debt,
            info: info
        })
    },
    addMoney: async (req, res, next) => {
        res.render("user/loginPayment",{
            layout: "user"
        })
        
    },
    addMoneyHandleLogin: async (req, res, next) => {
        // res.send(req.body)
        let temp = await axios.post('http://localhost:3001/api/login',{
            username: req.body.username,
            password: req.body.password
        });
        let token = temp.data;
        if(token.error === 1){
            res.render('user/loginPayment',{
                layout:'user',
                error: 'Thông tin tài khoản mật khẩu không chính xác!'
            });
        }else{
            // req.session.token = token;
            const decoded = jwt.verify(token.accessToken, 'mysecret');
            
            userPayment = {
                token: token,
                userID : decoded.userID,
                username : decoded.username,
                permission : decoded.permission,
                accountBalance : decoded.accountBalance,
                accountNumber : decoded.accountNumber
            }
            req.session.userPayment = userPayment;
            res.redirect('/user/addMoney');
        }
        
    },
    addMoneyView: async (req, res, next) => {
        res.render("user/addMoney",{
            layout: "user"
        })
    },
    addMoneyHandle: async (req, res, next) => {
        let money = req.body.money;
        let username = req.session.user.username;
        let token = req.session.userPayment.token.accessToken;
        const agent = new https.Agent({  
            rejectUnauthorized: false
          });
        let addMoney = await axios.post(`https://localhost:3443/api/addMoney`,{
            "money":money
        },{
            httpsAgent: agent,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        if(addMoney.data.result === 1){
            res.redirect('/user/debt');
        }
    },
    paymentHistory: async (req, res, next) => {
        // if(req.session.userPayment){
            // let token = req.session.userPayment.token.accessToken;
            // let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOjIsInVzZXJuYW1lIjoidXNlcjEiLCJwZXJtaXNzaW9uIjoyLCJhY2NvdW50QmFsYW5jZSI6LTE5MDAwLCJhY2NvdW50TnVtYmVyIjoiMjIyMjIiLCJpYXQiOjE2NDI1OTAxMzB9.tSJKx7tzV7tUgBN9CLC9PlfSGoNhy5lI2koDt-hwHXY"
            let username = req.session.user.username;
            const agent = new https.Agent({  
                rejectUnauthorized: false
              });
            let getHistoryPayment = await axios.get(`https://localhost:3443/api/getHistoryPaymentOne/${username}`,{
                httpsAgent: agent
            });
            // res.send(getHistoryPayment.data)
            res.render("user/paymentHistory",{
                layout: "user",
                historyPayment: getHistoryPayment.data
            })
        // }
    },
    deleteNotification: async (req, res, next) => {
        
        let username = req.params.username;
        console.log(req.params);
        await userModel.deleteNotification(username);
        res.json({result: "thanh cong"});
    }
}