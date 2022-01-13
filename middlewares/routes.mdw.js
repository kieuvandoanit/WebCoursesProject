const restrict = require('../middlewares/user.mdw');
const homepage = require('../controllers/homepage.controller');
const guest = require('../controllers/guest.controller');
const admin = require('../controllers/admin.controller');
const manager = require('../controllers/manager.controller')


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
    app.get('/manager', restrict.isManager, manager.homepage)
    app.get('/manager/addPatient', restrict.isManager, manager.addPatient)
    app.post('/manager/addPatientHandle', restrict.isManager, manager.addPatientHandle)
    app.get('/manager/getProduct', restrict.isManager, manager.getProduct)
    app.get('/manager/getPackage', restrict.isManager, manager.getPackage)

}