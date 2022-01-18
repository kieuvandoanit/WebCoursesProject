const restrict = require('../middlewares/user.mdw');
const homepage = require('../controllers/homepage.controller');
const guest = require('../controllers/guest.controller');
const admin = require('../controllers/admin.controller');
const manager = require('../controllers/manager.controller');
const user = require('../controllers/user.controller');
const product = require('../controllers/product.controller');
const paymentInfo = require('../controllers/paymentInfo.controller');


module.exports = (app) => {
    app.get('/', guest.login)
    app.post('/', guest.loginHandle)
    app.get('/logout', guest.logout)
    app.get('/admin', admin.homepage)
    app.get('/admin/createAccount', admin.createAcount)
    app.get('/admin/viewHistoryAction/:id', admin.viewHistoryAction)
    app.get('/admin/listHopital', admin.listHopital)
    app.get('/admin/addHopital', admin.addHopital)
    app.get('/admin/updateHopital/:id', admin.updateHopital)
    app.post('/admin/updateStatus/:id', admin.updateStatusHandle)
    app.post('/admin/createAcountHandle', admin.addAcountHandle)
    app.post('/admin/updateHopitalHandle/:id', admin.updateHopitalHandle)
    app.post('/admin/addHopitalHandle', admin.addHopitalHandle)

    // manager 
    app.get('/manager', manager.homepage)
    app.get('/manager/addPatient', manager.addPatient)
    app.post('/manager/addPatientHandle', manager.addPatientHandle)
    app.get('/manager/viewDetailPatient/:id', manager.viewDetailPatient)
    app.post('/manager', manager.findPatient)
    app.post('/manager/viewDetailPatient/:id', manager.updatePatientStatus)
    app.get('/manager/payment', paymentInfo.homepage);
    app.get('/manager/payment/change', paymentInfo.changeLimit);
    app.post('/manager/payment/change', paymentInfo.changeLimitHandle);
    app.get('/manager/notification/:username', paymentInfo.notification);
    app.get('/manager/peopleEachState', manager.peopleEachState);
    app.get('/manager/statisticsChangeStatus', manager.statisticsChangeStatus);
    app.get('/manager/sortByYOB', manager.sortByYOB);
    app.post('/manager/sortByYOB', manager.findPatient)
    app.get('/manager/sortByStatus', manager.sortByStatus);
    app.post('/manager/sortByStatus', manager.findPatient)


    // restrict.isManager
    app.get('/manager/getProduct', manager.getProduct)
    app.get('/manager/getPackage', manager.getPackage)
    app.get('/manager/deleteProduct/:id', manager.DeleteProduct)
    app.get('/manager/DeletePackageAction/:id', manager.DeletePackage)
    app.post('/manager/getProduct', manager.findProduct)
    app.post('/manager/getPackage', manager.findPackage)
    app.get('/manager/getProductByPriceASC', manager.orderProductByPriceASC)
    app.get('/manager/addProduct', manager.addProduct)
    app.post('/manager/addProductHandle', manager.addProductHandle)
    app.get('/manager/filterProductByCategory', manager.FilterProductByCategory)
    app.post('/manager/editProductAction/:id', manager.editProductAction)
        // app.post('/manager/editProductAction/:id', manager.editProductAction)
    app.get('/manager/editProduct/:id', manager.updateProduct)
    app.get('/manager/viewPackageAction/:id', manager.DetailPackage)
    app.post('/manager/editPackageAction/:id', manager.editPackageAction)
    app.get('/manager/DeleteProductFromPackage/:id', manager.DeleteProductFromPackage)
    app.get('/manager/addPackage', manager.addPackage)
    app.post('/manager/addPackageHandle', manager.addPackageHandle)
        //User

    app.get('/user/userInfo', user.accountMain)
    app.get('/user/changePassword/:id', user.updatePassword)
    app.post('/user/changePassword/:id', user.handleUpdatePassword)

    app.get('/payment/login', paymentInfo.login);
    app.post('/payment/login', paymentInfo.loginHandle);
    app.get('/user/payment', paymentInfo.userPayment);
    app.get('/user/payment/addOrder', paymentInfo.addOrder);

    app.get('/user/cart', paymentInfo.userCart);
    //product
    app.get('/package', product.getProductPackage)
    app.post('/package', product.searchPackage)
    app.get('/productDetails', product.getProductDetails)
    app.get('/cart', product.sessionProduct)
    app.post('/cart', product.addToCart)
    app.post('/cartUpdate', product.cartUpdate)
    app.post('/removeFromCart', product.removeFromCart)
}