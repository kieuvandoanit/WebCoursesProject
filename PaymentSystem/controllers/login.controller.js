const guestModel = require('../model/guest.model')
const jwt = require('jsonwebtoken');

module.exports={
    login: async(req, res, next) =>{
        res.render('login');
    },
    loginHandle: async(req, res, next) =>{
        let username = req.body.userName;
        let password = req.body.password;
        let result = await guestModel.login(username, password);
        if(result !== 0){
            let userID = result.userID;
            let username = result.userName;
            let permission = result.permission;
            let accountBalance = result.accountBalance;
            let accountNumber = result.accountNumber;
            let user = {userID: userID, username: username, permission: permission, accountBalance: accountBalance, accountNumber: accountNumber};
            req.session.user = user;

            if(String(permission) === "1"){
                res.redirect('/admin');
            }
            if(String(permission) === "2"){
                res.redirect('/')
            }
        }else{
            res.redirect('/');
        }
    },

    logout: async(req, res, next) =>{
        req.session.destroy();
        res.redirect('/login');
    },

    apiLogin: async(req, res, next) =>{

        let username = req.body.username;
        let password = req.body.password;
        let result = await guestModel.login(username, password);
        if(result !== 0){
            let userID = result.userID;
            let username = result.userName;
            let permission = result.permission;
            let accountBalance = result.accountBalance;
            let accountNumber = result.accountNumber;
            let user = {userID: userID, username: username, permission: permission, accountBalance: accountBalance, accountNumber: accountNumber};
            
            // create jwt
            const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
            res.json({accessToken});   
        }else{
            res.sendStatus(401)
        }
    }
}