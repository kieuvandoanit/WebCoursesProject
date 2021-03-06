const productModel = require('../model/product.model'),
    userModel = require('../model/user.model'),
    pool = require('../utils/database');

module.exports = {
    getProductPackage: async (req, res, next) => {
        let package = await productModel.getProductPackage(),
            userID = req.session.user.userID,
            user = await userModel.getUser(userID);
        res.render("product/listPackage", {
            user: user,
            package: package,
            layout: "user"
        })
    },

    getProductDetails: async (req, res, next) => {
        let product = await productModel.getProductDetails(req.query.productID),
            userID = req.session.user.userID,
            user = await userModel.getUser(userID);
        res.render("product/packageDetails", {
            product: product,
            user: user,
            layout: "user"
        })
    },

    sessionProduct: async (req, res, next) => {
        let userID = req.session.user.userID;
            user = await userModel.getUser(userID);
        if (req.session.cart) {
            req.session.cartInfo = [];
            for (let index = 0; index < req.session.cart.length; index++) {
                if (req.session.cart[index].userID === userID) {
                    req.session.cartInfo.push(req.session.cart[index]);
                }
            }
            for (let index = 0; index < req.session.cartInfo.length; index++) {
                let package = await productModel.getSpecificPackage(req.session.cartInfo[index].packageID),
                    product = await productModel.getProductDetails(req.session.cartInfo[index].packageID);
                req.session.cartInfo[index].packageName = package.package_Name
                req.session.cartInfo[index].product = product
                for (let index2 = 0; index2 < req.session.cartInfo[index].product.length; index2++) {
                    req.session.cartInfo[index].product[index2].quantity = product[index2].number * req.session.cartInfo[index].quantity
                }
            }
            res.render("product/cart", {
                user: user,
                cartInfo: req.session.cartInfo,
                layout: "user"
            })
        } else {
            res.render("product/cart", {
                user: user,
                cartInfo: req.session.cartInfo,
                layout: "user"
            })
        }

    },

    addToCart: async (req, res, next) => {
        let packageID = req.body.packageID;
        let userID = req.session.user.userID;
        let quantity = 1;
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
    },

    cartUpdate: async (req, res, next) => {
        let packageID = req.body.packageID,
            productID = parseInt(req.body.productID),
            method = req.body.method,
            product = await productModel.getSpecificPackage(packageID);
        if (method === 'inc') {
            for (let index = 0; index < req.session.cartInfo.length; index++) {
                if (req.session.cartInfo[index].packageID === packageID) {
                    if (productID > 0) {
                        for (let index2 = 0; index2 < req.session.cartInfo[index].product.length; index2++) {
                            if (req.session.cartInfo[index].product[index2].ProductID === productID) {
                                limit = req.session.cartInfo[index].quantity * product.limited_ProductQuantity;
                                if (req.session.cartInfo[index].product[index2].quantity < limit) {
                                    req.session.cartInfo[index].product[index2].quantity += 1;
                                    res.status(200).send({ quantity: req.session.cartInfo[index].product[index2].quantity })
                                    return;
                                } else {
                                    res.status(200).send({ quantity: req.session.cartInfo[index].product[index2].quantity })
                                    return;
                                }
                            }
                        }
                    } else {
                        if(req.session.cartInfo[index].quantity < product.limited_PackageQuantity) {
                            req.session.cartInfo[index].quantity += 1;
                            res.status(200).send({ quantity: req.session.cartInfo[index].quantity })
                            return;
                        } else {
                            res.status(200).send({ quantity: req.session.cartInfo[index].quantity })
                            return;
                        }
                    }
                }
            }
        } else if (method === 'des') {
            for (let index = 0; index < req.session.cartInfo.length; index++) {
                if (req.session.cartInfo[index].packageID === packageID) {
                    if (productID > 0) {
                        for (let index2 = 0; index2 < req.session.cartInfo[index].product.length; index2++) {
                            if (req.session.cartInfo[index].product[index2].ProductID === productID) {
                                if (req.session.cartInfo[index].product[index2].quantity > 1) {
                                    req.session.cartInfo[index].product[index2].quantity -= 1;
                                    res.status(200).send({ quantity: req.session.cartInfo[index].product[index2].quantity })
                                    return;
                                } else {
                                    res.status(200).send({ quantity: req.session.cartInfo[index].product[index2].quantity })
                                    return;
                                }
                            }
                        }
                    } else {
                        if (req.session.cartInfo[index].quantity > 1){
                            req.session.cartInfo[index].quantity -= 1;
                            res.status(200).send({ quantity: req.session.cartInfo[index].quantity })
                            return;
                        } else {
                            res.status(200).send({ quantity: req.session.cartInfo[index].quantity })
                            return;
                        }
                        
                    }
                }
            }
        }
    },

    removeFromCart: async (req, res, next) => {
        let packageID = req.body.packageID;
        for (let index = 0; index < req.session.cart.length; index++) {
            if (req.session.cart[index].packageID === packageID) {
                req.session.cart.splice(index, 1)
                res.status(200).send();
            }
        }
    },

    searchPackage: async (req, res, next) => {
        let packageName = req.body.packageName,
            package = await productModel.searchPackage(packageName),
            userID = req.body.userID;
        user = await userModel.getUser(userID);
        res.render("product/listPackage", {
            packageName: packageName,
            user: user,
            package: package,
            layout: "user"
        })
        return;
    },
    test: async (req, res, next) => {
        res.send(req.session.cartInfo)
    }
}