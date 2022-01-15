const restrict = require('../middlewares/user.mdw');
const account = require('../controllers/login.controller');
const admin = require('../controllers/admin.controller');
const user = require('../controllers/user.controller');
const verifyToken = require('../middlewares/auth.mdw')



module.exports = (app) =>{
    app.get('/login',account.login);
    app.post('/login', account.loginHandle);
    app.get('/admin',restrict.isAdmin, admin.homepage);
    app.get('/checkBalance',restrict.user, user.checkBalance);
    app.get('/createAccount',restrict.isAdmin, admin.createAccount);
    app.post('/createAccount',restrict.isAdmin, admin.createAccountHandle);
    app.get('/changePassword',restrict.user, user.changePassword);
    app.post('/changePassword', restrict.user, user.changePasswordHandle);
    app.get('/historyTransaction',restrict.isAdmin, admin.historyTransaction);
    app.post('/historyTransaction',restrict.isAdmin, admin.historyTransactionFilter);

    app.get('/',restrict.user, user.homepage);
    app.get('/historyTransactionUser',restrict.user, user.historyTransactionUser);

    app.get('/logout',restrict.user, account.logout);

    app.get('/addMoney', restrict.user, user.addMoney);
    app.post('/addMoney', restrict.user, user.addMoneyHandle);

    //api
    app.post('/api/login', account.apiLogin);
    app.post('/api/createAccount', admin.apiCreateAccount);
    app.post('/api/payment',verifyToken, user.apiPayment);


}
//api: create account, chuyen tien, login 