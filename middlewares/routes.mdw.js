const restrict = require('../middlewares/user.mdw');
const homepage = require('../controllers/homepage.controller');
const guest = require('../controllers/guest.controller');
const admin = require('../controllers/admin.controller');


module.exports = (app) =>{
    app.get('/',guest.login)
    app.post('/',guest.loginHandle)
    app.get('/admin',restrict.isAdmin, admin.homepage)
    app.get('/admin/createAccount', restrict.isAdmin, admin.createAcount)
    app.get('/admin/viewHistoryAction/:id', restrict.isAdmin, admin.viewHistoryAction)
    app.get('/admin/listHopital',restrict.isAdmin, admin.listHopital)
    app.get('/admin/addHopital', restrict.isAdmin, admin.addHopital)
    app.get('/admin/updateHopital/:id',restrict.isAdmin,admin.updateHopital)
}