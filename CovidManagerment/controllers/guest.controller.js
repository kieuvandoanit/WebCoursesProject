const guestModel = require('../model/guest.model');
const md5 = require('md5');
module.exports={
    login: async(req, res, next) =>{
        // kiem tra xem co tk admin chua
        let checkAdmin = await guestModel.checkAdmin();
        if(checkAdmin.rowCount === 0){
            //tao admin

            let addAdmin = await guestModel.createAdmin();
            res.render("guest/login",{
                info:"Tài khoản admin mới được khởi tạo. Username: admin, password: 123"
            })
        }else{
            res.render("guest/login")
        }
        
    },
    loginHandle: async(req, res, next) =>{
        let username = req.body.username;
        let passwordTemp = req.body.password;
        let password = md5(req.body.password);
        let result = await guestModel.login(username, password);
        if(result !== 0){
            let userID = result.userID;
            let username = result.userName;
            let permission = result.permission;

            

            if(String(permission) === "1"){
                let user = {userID: userID, username: username, permission: permission};
                req.session.user = user;
                res.redirect('/admin');
            }
            if(String(permission) === "2"){

                // insert vao history
                let date = new Date();
                let year = date.getFullYear();
                let month = date.getMonth() + 1;
                let day = date.getDate();
                let hour = date.getHours();
                let minutes = date.getMinutes();
                let second = date.getSeconds();
                let timenow = `${year}-${month}-${day} ${hour}:${minutes}:${second}`;

                let result = await guestModel.insertHistory(userID, timenow);
                let getHistory = await guestModel.getHistory(userID, timenow);
                let historyID = 0;
                if(getHistory !== 0){
                    historyID = getHistory.HistoryID;
                }
                
                
                let user = {userID: userID, username: username, permission: permission, historyID: historyID};
                req.session.user = user;
                res.redirect('/manager');
            }
            if(String(permission) === "3"){
                let user = {userID: userID, username: username, permission: permission};
                req.session.user = user;
                if(passwordTemp === '123456'){
                    // redirect den trang doi mat khau
                    res.redirect(`/user/changePassword`);
                }
                res.redirect(`/user/userInfo`);

            }
        }else{
            res.redirect('/');
        }
    },
    logout: async(req, res, next) => {
        let permistion = req.session.user.permission;
        if(req.session.user.permission === 2){
            // update logout time
            let historyID = req.session.user.historyID;
            let date = new Date();
            let year = date.getFullYear();
            let month = date.getMonth() + 1;
            let day = date.getDate();
            let hour = date.getHours();
            let minutes = date.getMinutes();
            let second = date.getSeconds();
            let timenow = `${year}-${month}-${day} ${hour}:${minutes}:${second}`;

            let updateLogout = await guestModel.logoutTime(historyID, timenow);
        }
        req.session.destroy();
        res.redirect('/');
    }
}