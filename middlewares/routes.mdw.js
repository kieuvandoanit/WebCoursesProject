const homepage = require('../controllers/homepage.controller');

module.exports = (app) =>{
    app.get('/',homepage.homepage)
}