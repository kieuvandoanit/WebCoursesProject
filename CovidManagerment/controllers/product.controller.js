const productModel = require('../model/product.model'),
    userModel = require('../model/user.model'),
    pool = require('../utils/database');

module.exports = {
    getProductPackage: async(req, res, next) => {
        let package = await productModel.getProductPackage(),
            userID = req.query.userID,
            user = await userModel.getUser(userID);
        res.render("product/listPackage", {
            user: user,
            package: package,
            layout: "product"
        })
    },
}