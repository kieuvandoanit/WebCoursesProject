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

    //Giang

    app.get('/manager/getProduct', restrict.isManager, manager.getProduct)
    app.get('/manager/getPackage', restrict.isManager, manager.getPackage)
    app.get('/manager/deleteProduct/:id', restrict.isManager, manager.DeleteProduct)
    app.get('/manager/DeletePackageAction/:id', restrict.isManager, manager.DeletePackage)


    // app.post('/manager/getProduct', restrict.isManager, manager.findProduct)
    // app.post('/manager/getPackage', restrict.isManager, manager.findPackage)


    //User

    app.get('/user/userInfo', user.accountMain)
    app.get('/user/changePassword/:id', user.updatePassword)
    app.post('/user/changePassword/:id', user.handleUpdatePassword)

    app.get('/payment/login', paymentInfo.login);
    app.post('/payment/login', paymentInfo.loginHandle);
    app.get('/user/payment', paymentInfo.userPayment);
    app.get('/user/payment/addOrder', paymentInfo.addOrder);


    //product
    app.get('/package', product.getProductPackage)
    app.get('/productDetails', product.getProductDetails)
    app.get('/cart', product.sessionProduct)
    app.post('/cart', product.addToCart)
    app.post('/cartUpdate', product.cartUpdate)
    app.post('/removeFromCart', product.removeFromCart)
}