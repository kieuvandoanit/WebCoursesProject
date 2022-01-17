const guestModel = require('../model/guest.model');
const userModel = require('../model/user.model');
const md5 = require('md5');

module.exports={
    checkBalance: async(req, res, next) =>{
        // res.send(req.session.user)
        let userInfo = await userModel.infoUser(req.session.user.userID);
        let accountBalance = userInfo.accountBalance;
        let accountNumber = req.session.user.accountNumber;
        let curDate = new Date();
        let result = {
            accountBalance: accountBalance,
            accountNumber: accountNumber,
            curDate: curDate
        }
        if(req.session.user.permission === 1){
            res.render('checkBalance',{
                layout: 'admin',
                result: result
            });
        }else{
            res.render('checkBalance',{
                layout: 'user',
                result: result
            });
        }
        
    },
    changePassword: async(req, res, next) =>{
        if(req.session.user.permission === 1){
            res.render('changePassword',{
                layout: 'admin'
            })
        }else{
            res.render('changePassword',{
                layout: 'user'
            })
        }
    },
    changePasswordHandle: async(req, res, next) =>{
        let oldPassword = md5(req.body.oldPassword);
        let newPassword = req.body.newPassword;
        let newPasswordAgain = req.body.newPasswordAgain;

        if(newPasswordAgain !== newPassword){
            let error = "Nhập mật khẩu mới không khớp!";
            if(req.session.user.permission === 1){
                res.render('changePassword',{
                    layout: 'admin',
                    error: error
                });
            }else{
                res.render('changePassword',{
                    layout: 'user',
                    error: error
                })
            }
            
        }

        let userID = req.session.user.userID;
        //kiem tra mat khau cu dung ko
        let check = await userModel.beforeChangePassword(userID, oldPassword);
        if(check.rowCount === 1){
            let result = await userModel.changePassword(userID, md5(newPassword));
            if(result.rowCount === 1){
                let success = 'Thay đổi mật khẩu thành công!';
                
                if(req.session.user.permission === 1){
                    res.render('changePassword',{
                        layout: 'admin',
                        success: success
                    });
                }else{
                    res.render('changePassword',{
                        layout: 'user',
                        success: success
                    });
                }
            }
        }else{
            let error = 'Mật khẩu hiện tại không đúng';
            if(req.session.user.permission === 1){
                res.render('changePassword',{
                    layout: 'admin',
                    error: error
                });
            }else{
                res.render('changePassword',{
                    layout: 'user',
                    error: error
                })
            }
        }
    },

    homepage: async(req, res, next) =>{
        res.render('homepage',{
            layout: 'user'
        })
    },
    historyTransactionUser: async(req, res, next) =>{
        let accountNumber = req.session.user.accountNumber;
        let result = await userModel.historyTransaction(accountNumber);
        let transactions = result.rows;
        res.render('historyTransaction',{
            layout: 'user',
            transactions: transactions
        }); 
    },
    apiPayment: async(req, res, next) =>{
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        let hour = date.getHours();
        let minutes = date.getMinutes();
        let second = date.getSeconds();
        let timenow = `${year}-${month}-${day} ${hour}:${minutes}:${second}`;


        let totalPrice = req.body.totalPrice;
        let accountBalance = req.accountBalance;
        let paymentFor = req.body.paymentFor;
        let limit = req.body.limit;
        //Kiem tra so tien con du > totalPrice
        if((accountBalance + limit) < totalPrice){
            res.json({
                result: -1
            });
        }else{
            //Update tien vao tk chinh
            addMoney = await userModel.updateMoney(1, totalPrice);
            
            if(addMoney.rowCount === 1){
                // Tru tien vao tk khach hang
                divMoney = await userModel.updateMoney(req.userID, -totalPrice);
                if(divMoney.rowCount === 1){
                    //Them vao bang lich su thanh toan
                    addHistory = await userModel.insertHistory(req.userID, totalPrice, timenow, paymentFor);
                    if(addHistory.rowCount === 1){
                        res.json({
                            result: 1
                        });
                    }else{
                        //add history error
                        let temp1 = await userModel.updateMoney(1, -totalPrice);
                        let temp2 = await userModel.updateMoney(req.userID, totalPrice);
                        res.json({result: 0});
                    }
                }else{
                    // tru tien bi loi
                    let temp3 = await userMode.updateMoney(1, -totalPrice);
                    res.json({result: 0});
                }
            }else{
                //chuyen vao tk chinh bi loi
                res.json({result: 0});
            }
        }
    },
    addMoney: async(req, res, next) =>{
        res.render('addMoney',{
            layout:"user"
        })
    },
    addMoneyHandle: async(req, res, next) =>{
        let money = req.body.money;
        let userID = req.session.user.userID;

        let result = await userModel.updateMoney(userID, money);
        if(result.rowCount === 1){
            res.render('addMoney',{
                layout:'user',
                status: "Nạp tiền vào tài khoản thành công!"
            });
        }else{
            res.render('addMoney',{
                layout:'user',
                error: "Nạp tiền vào tài khoản thất bại!"
            });
        }
    },
    apiDebt: async(req, res, next) => {
        let result = await userModel.getDebt();
        res.json(result.rows);
    }
}