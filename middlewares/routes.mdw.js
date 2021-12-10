const homepage = require('../controllers/homepage.controller');
const guest = require('../controllers/guest.controller');
const admin = require('../controllers/admin.controller')

module.exports = (app) =>{
    app.get('/',guest.login)
    app.post('/',guest.loginHandle)
    app.get('/admin', admin.homepage)
}