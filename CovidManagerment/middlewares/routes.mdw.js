const restrict = require('../middlewares/user.mdw');
const homepage = require('../controllers/homepage.controller');
const guest = require('../controllers/guest.controller');
const admin = require('../controllers/admin.controller');
const manager = require('../controllers/manager.controller');
const user = require('../controllers/user.controller');


module.exports = (app) => {
    app.get('/', guest.login)
    app.post('/', guest.loginHandle)
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
    //Duy
    app.get('/manager', manager.homepage)
    app.get('/manager/addPatient', manager.addPatient)
    app.post('/manager/addPatientHandle', manager.addPatientHandle)
    app.get('/manager/viewDetailPatient/:id', manager.viewDetailPatient)
    app.post('/manager', manager.findPatient)
    app.post('/manager/viewDetailPatient/:id', manager.updatePatientStatus)

    //Giang
    // restrict.isManager
    app.get('/manager/getProduct', manager.getProduct)
    app.get('/manager/getPackage', manager.getPackage)
    app.get('/manager/deleteProduct/:id', manager.DeleteProduct)
    app.get('/manager/DeletePackageAction/:id', manager.DeletePackage)
    app.post('/manager/getProduct', manager.findProduct)
    app.post('/manager/getPackage', manager.findPackage)


    //User

    app.get('/user/userInfo', user.accountMain)
    app.get('/user/changePassword/:id', user.updatePassword)
    app.post('/user/changePassword/:id', user.handleUpdatePassword)

}