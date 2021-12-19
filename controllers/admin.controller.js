const adminModel = require('../model/admin.model')

module.exports ={
    homepage: async(req, res, next) =>{
        let manager = await adminModel.getAllAcountManager();
        res.render("admin/accountManager",{
            manager: manager,
            layout: "admin"
        })
    },
    createAcount: async(req, res, next) =>{
        res.render("admin/createAccount",{
            layout: "admin"
        })
    },
    addAcountHandle: async(req, res, next) =>{
        let username = req.body.username;
        let password = req.body.password;
        let result = await adminModel.createAccount(username, password);

        if(result.rowCount >= 1){
            res.redirect("/admin");
        }else{
            res.redirect("/admin/createAcount");
        }
    },
    viewHistoryAction: async(req, res, next) =>{
        let userId = req.params.id;
        let activeTime = await adminModel.getHistoryActive(userId);
        let userInfo = await adminModel.getOneUser(userId);
        if(activeTime !== 0 && userInfo !== 0){
            res.render("admin/historyAction",{
                userInfo: userInfo,
                userID: userId,
                activeTime: activeTime,
                layout: "admin"
            })
        }else{
            res.send("Không có thông tin")
        } 
    },
    updateStatusHandle: async(req, res, next) =>{
        let userID = req.params.id;
        let status = req.body.status;

        let result = await adminModel.updateStatusUser(userID, status);
        if(result.rowCount === 1){
            res.redirect('/admin')
        }else{
            res.redirect('/admin/viewHistoryAction/'+userID);
        }
    },
    listHopital: async(req, res, next) =>{
        let listHopital = await adminModel.getListHopital();
        if(listHopital !== 0){
            res.render("admin/listHopital",{
                listHopital: listHopital,
                layout: "admin"
            }) 
        }else{
            res.send("Không có thông tin");
        }
    },
    addHopital: async(req, res, next) =>{
        res.render("admin/addHopital",{
            layout: "admin"
        })
    },
    updateHopital: async(req, res, next) =>{
        let hopitalID = req.params.id;
        let info = await adminModel.getHopitalInfo(hopitalID);
        if(info !== 0){
            res.render("admin/updateHopital",{
                info: info[0],
                layout: "admin"
            })
        }else{
            res.send("Không tìm thấy thông tin");
        }
        
    },
    updateHopitalHandle: async(req, res, next) =>{
        let hopitalName = req.body.hopitalName;
        let 
    }
}