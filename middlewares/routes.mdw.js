const restrict = require('../middlewares/user.mdw');
const homepage = require('../controllers/homepage.controller');
const guest = require('../controllers/guest.controller');
const admin = require('../controllers/admin.controller');


module.exports = (app) =>{
    app.get('/',guest.login)
    app.post('/',guest.loginHandle)
    app.get('/admin', admin.homepage)
    app.get('/admin/createAccount', admin.createAcount)
    app.get('/admin/viewHistoryAction/:id', admin.viewHistoryAction)
    app.get('/admin/listHopital', admin.listHopital)
    app.get('/admin/addHopital', admin.addHopital)
    app.get('/admin/updateHopital/:id',admin.updateHopital)
    app.post('/admin/updateStatus/:id', admin.updateStatusHandle)
    app.post('/admin/createAcountHandle',admin.addAcountHandle)
}