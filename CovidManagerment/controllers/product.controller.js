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

    getProductDetails: async(req, res, next) => {
        let product = await productModel.getProductDetails(req.query.productID),
            userID = req.query.userID,
            user = await userModel.getUser(userID);
        res.render("product/packageDetails", {
            product: product,
            user: user,
            layout: "user"
        })
    },
    
    sessionProduct: async (req, res, next) => {
        let userID = req.query.userID,
            cartInfo = [],
            user = await userModel.getUser(userID);
        if (req.session.cart)
        {
            for (let index = 0; index < req.session.cart.length; index++) {
                if (req.session.cart[index].userID === userID) {
                    cartInfo.push(req.session.cart[index]);
                }
            }
            for (let index = 0; index < cartInfo.length; index++) {
                let package = await productModel.getSpecificPackage(cartInfo[index].packageID),
                    product = await productModel.getProductDetails(cartInfo[index].packageID);
                cartInfo[index].packageName = package.package_Name
                cartInfo[index].product = product
            }
             res.render("product/cart", {
                 user: user,
                 cartInfo: cartInfo,
                 layout: "user"
             })
        } else {
            res.render("product/cart", {
                user: user,
                cartInfo: cartInfo,
                layout: "user"
            })
        }
        
    },

    addToCart: async (req, res, next) => {
        let packageID = req.body.packageID,
            userID = req.body.userID,
            quantity = 1;
        if (!req.session.cart) {
            req.session.cart = [];
            req.session.cart.push({
                userID: userID,
                quantity: quantity,
                packageID: packageID
            })
            res.status(200).send();
        } else {
            for (let index = 0; index < req.session.cart.length; index++) {
                if (packageID === req.session.cart[index].packageID) {
                    req.session.cart[index].quantity += 1;
                    res.status(200).send();
                }
            }
            req.session.cart.push({
                userID: userID,
                quantity: quantity,
                packageID: packageID                
            })
            res.status(200).send();
        }
    }
}