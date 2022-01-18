const guestModel = require('../model/guest.model');
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
        let password = req.body.password;
        let result = await guestModel.login(username, password);
        // res.send(result);
        if(result !== 0){
            let userID = result.userID;
            let username = result.userName;
            let permission = result.permission;

            let user = {userID: userID, username: username, permission: permission};
            req.session.user = user;

            if(String(permission) === "1"){
                res.redirect('/admin');
            }
            if(String(permission) === "2"){
                res.redirect('/manager');
            }
            if(String(permission) === "3"){
                if(password === '123456'){
                    // redirect den trang doi mat khau
                    res.redirect(`/user/changePassword/${userID}`);
                }
                res.redirect(`/user/userInfo?userID=${userID}`);

            }
        }else{
            res.redirect('/');
        }
    },
    logout: async(req, res, next) => {
        req.session.destroy();
        res.redirect('/');
    }
}