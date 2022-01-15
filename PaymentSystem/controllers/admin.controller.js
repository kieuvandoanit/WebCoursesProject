const userModel = require('../model/user.model');
const md5 = require('md5');

module.exports={
    homepage: async(req, res, next) =>{
        res.render('admin/homepage',{
            layout: "admin"
        });
    },
    createAccount: async(req, res, next) =>{
        res.render('admin/createAccount',{
            layout: 'admin',
        });
    },
    historyTransaction: async(req, res, next) =>{
        let result = await userModel.historyTransactionAll();
        let transactions = result.rows;
        res.render('admin/historyTransaction',{
            layout: 'admin',
            transactions: transactions
        });
    },
    createAccountHandle: async(req, res, next) =>{
        // res.send(req.body);
        let username = req.body.username;
        let password = req.body.password;
        if(username === "" || password === ""){
            let error = "Thông tin tài khoản, mật khẩu không được để trống!";
            res.render('admin/createAccount',{
                layout: 'admin',
                error: error
            });
        }
        let result = await userModel.createUser(username, md5(password));
        if(result.rowCount === 1){
            res.redirect('/admin');
        }else{
            let error = "Tạo tài khoản thất bại. Vui lòng kiểm tra lại thông tin!";
            res.render('admin/createAccount',{
                layout: 'admin',
                error: error
            });
        }
    },
    apiCreateAccount: async(req, res, next) =>{
        let username = req.body.username;
        let password = req.body.password;
        if(username === "" || password === ""){
            res.json({ 
                result: -1
            })
        }
        let result = await userModel.createUser(username, md5(password));
        if(result.rowCount === 1){
            res.json({ result : 1})
        }else{
            res.json({result:0})
        }
    },
    historyTransactionFilter: async(req, res, next) =>{
        let accountNumber = req.body.accountNumber;
        let result = await userModel.historyTransaction(accountNumber);
        let transactions = result.rows;
        res.render('admin/historyTransaction',{
            layout: 'admin',
            transactions: transactions
        });
    }
}