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
    app.get('/logout',restrict.user, guest.logout)

    app.get('/admin',restrict.isAdmin, admin.homepage)
    app.get('/admin/createAccount',restrict.isAdmin, admin.createAcount)
    app.get('/admin/viewHistoryAction/:id',restrict.isAdmin, admin.viewHistoryAction)
    app.get('/admin/listHopital',restrict.isAdmin, admin.listHopital)
    app.get('/admin/addHopital',restrict.isAdmin, admin.addHopital)
    app.get('/admin/updateHopital/:id',restrict.isAdmin, admin.updateHopital)
    app.get('/admin/deleteHopital/:id',restrict.isAdmin, admin.deleteHopital)
    app.post('/admin/updateStatus/:id',restrict.isAdmin, admin.updateStatusHandle)
    app.post('/admin/createAcountHandle',restrict.isAdmin, admin.addAcountHandle)
    app.post('/admin/updateHopitalHandle/:id',restrict.isAdmin, admin.updateHopitalHandle)
    app.post('/admin/addHopitalHandle',restrict.isAdmin, admin.addHopitalHandle)

    // manager 
    app.get('/manager',restrict.isManager, manager.homepage)
    app.get('/manager/addPatient',restrict.isManager, manager.addPatient)
    app.post('/manager/addPatientHandle',restrict.isManager, manager.addPatientHandle)
    app.get('/manager/viewDetailPatient/:id',restrict.isManager, manager.viewDetailPatient)
    app.post('/manager',restrict.isManager, manager.findPatient)
    app.post('/manager/viewDetailPatient/:id',restrict.isManager, manager.updatePatientStatus)
    app.get('/manager/payment',restrict.isManager, paymentInfo.homepage);
    app.get('/manager/payment/change',restrict.isManager, paymentInfo.changeLimit);
    app.post('/manager/payment/change',restrict.isManager, paymentInfo.changeLimitHandle);
    app.get('/manager/notification/:username',restrict.isManager, paymentInfo.notification);
    app.get('/manager/peopleEachState',restrict.isManager, manager.peopleEachState);
    app.get('/manager/statisticsChangeStatus',restrict.isManager, manager.statisticsChangeStatus);
    app.get('/manager/statisticsPackageProduct',restrict.isManager, manager.statisticsPackageProduct);
    app.get('/manager/statisticsUsedProduct',restrict.isManager, manager.statisticsUsedProduct);
    app.get('/manager/statisticsDebtPayment',restrict.isManager, manager.statisticsDebtPayment);
    app.get('/manager/sortByYOB',restrict.isManager, manager.sortByYOB);
    app.post('/manager/sortByYOB',restrict.isManager, manager.findPatient);
    app.get('/manager/sortByStatus',restrict.isManager, manager.sortByStatus);
    app.post('/manager/sortByStatus',restrict.isManager, manager.findPatient);
    


    // restrict.isManager
    app.get('/manager/getProduct',restrict.isManager, manager.getProduct)
    app.post('/manager/getProduct',restrict.isManager, manager.findProduct)
    app.get('/manager/deleteProduct/:id',restrict.isManager, manager.DeleteProduct)
    app.get('/manager/getProductByPriceASC',restrict.isManager, manager.orderProductByPriceASC)
    app.post('/manager/getProductByPriceASC',restrict.isManager, manager.findProduct)
    app.get('/manager/addProduct',restrict.isManager, manager.addProduct)
    app.post('/manager/addProductHandle',restrict.isManager, manager.addProductHandle)
    
    app.get('/manager/filterProductByCategory',restrict.isManager, manager.FilterProductByCategory)
    app.post('/manager/filterProductByCategory',restrict.isManager, manager.findProduct)

    app.post('/manager/editProductAction/:id',restrict.isManager, manager.editProductAction)
    app.get('/manager/editProduct/:id',restrict.isManager, manager.updateProduct)

    app.get('/manager/detailProduct/:id',restrict.isManager, manager.detailProduct)
    
    app.get('/manager/getPackage',restrict.isManager, manager.getPackage)
    app.post('/manager/getPackage',restrict.isManager, manager.findPackage)
    
    app.get('/manager/viewPackageAction/:id',restrict.isManager, manager.DetailPackage)
    app.get('/manager/editPackageAction/:id',restrict.isManager, manager.editPackageAction)
    app.get('/manager/editInfoPackage/:packageID',restrict.isManager, manager.editInfoPackage)
    app.post('/manager/editInfoPackage/:packageID',restrict.isManager, manager.updateInfoPackage)

    app.get('/manager/package/deleteProduct',restrict.isManager, manager.deleteProductFromPackage)

    app.get('/manager/addProductIntoPackage/:packageID',restrict.isManager, manager.addProductIntoPackage)
    app.post('/manager/addProductIntoPackage/:packageID',restrict.isManager, manager.addProductIntoPackageHandle)
    


    app.get('/manager/DeletePackageAction/:id',restrict.isManager, manager.DeletePackage)
    
    app.get('/manager/addPackage',restrict.isManager, manager.addPackage)
    app.post('/manager/addPackageHandle',restrict.isManager, manager.addPackageHandle)


    app.get('/manager/changeHospital/:patientID',restrict.isManager, manager.changeHospital)
    app.post('/manager/changeHospital/:patientID',restrict.isManager,manager.changeHospitalHandle)
        //User

    app.get('/user/userHistoryPayment',restrict.user, user.paymentHistory)
    app.get('/user/userInfo',restrict.user, user.accountMain)
    app.get('/user/debt',restrict.user, user.viewDebt)
    app.get('/user/addMoney',restrict.user, user.addMoneyView)
    app.get('/user/loginPaymentSystem',restrict.user,user.addMoney)
    app.post('/user/loginPaymentSystem',restrict.user, user.addMoneyHandleLogin)
    app.post('/user/addMoney',restrict.user, user.addMoneyHandle)
    app.get('/user/changePassword',restrict.user, user.updatePassword)
    app.post('/user/changePassword',restrict.user, user.handleUpdatePassword)

    app.get('/user/package', restrict.user, product.getProductPackage);
    app.get('/user/notification', restrict.user, user.notification);
    app.get('/user/managedHistory', restrict.user, user.managedHistory);
    app.get('/user/kitHistory', restrict.user, user.kitHistory);


    app.get('/payment/login',restrict.user, paymentInfo.login);
    app.post('/payment/login',restrict.user, paymentInfo.loginHandle);
    app.get('/user/payment', paymentInfo.userPayment);
    app.get('/user/payment/addOrder',restrict.user, paymentInfo.addOrder);

    app.get('/user/cart',restrict.user, paymentInfo.userCart);
    //product
    // app.get('/package',restrict.user, product.getProductPackage)
    app.post('/package',restrict.user, product.searchPackage)
    app.get('/productDetails',restrict.user, product.getProductDetails)
    app.get('/cart',restrict.user, product.sessionProduct)
    app.post('/cart',restrict.user, product.addToCart)
    app.post('/cartUpdate',restrict.user, product.cartUpdate)
    app.post('/removeFromCart',restrict.user, product.removeFromCart)


    app.get('/api/user/deleteNotification/:username', user.deleteNotification);
}