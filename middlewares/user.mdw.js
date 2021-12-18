module.exports = {
    user: (req, res, next) => {
        if (req.session.user === false) {
            req.session.retUrl = req.originalUrl;
            return res.redirect('/login');
        }
        next();
    },
    isAdmin:(req, res, next) =>{
        if(String(req.session.user.permission) != "1"){
            throw Error('Access denied!');
        }
        next();
    },
    isManager: (req, res, next) =>{
        if(String(req.session.user.permission) != "2"){
            throw Error('Access denied!');
        }
        next();
    },

}