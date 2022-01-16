const guestModel = require('../model/guest.model');
module.exports={
    login: async(req, res, next) =>{
        res.render("guest/login")
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
                res.redirect(`/user/userInfo?userID=${userID}`)
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