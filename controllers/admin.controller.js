const adminModel = require('../model/admin.model')

module.exports ={
    homepage: async(req, res, next) =>{
        res.render("admin/createAccount",{
            layout: "admin"
        })
    }
}