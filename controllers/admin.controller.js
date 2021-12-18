const adminModel = require('../model/admin.model')

module.exports ={
    homepage: async(req, res, next) =>{
        res.render("admin/accountManager",{
            layout: "admin"
        })
    },
    createAcount: async(req, res, next) =>{
        res.render("admin/createAccount",{
            layout: "admin"
        })
    },
    viewHistoryAction: async(req, res, next) =>{
        res.render("admin/historyAction",{
            layout: "admin"
        })
    }
}