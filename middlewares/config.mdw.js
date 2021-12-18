const hbs_sections = require('express-handlebars-sections');
const { engine } =require('express-handlebars');
module.exports = (app) => {
    app.engine('.hbs', engine({
        defaultLayout: 'main.hbs',
        extname: '.hbs',
        layoutsDir: 'views/_layouts',
        partialsDir: 'views/_partials',
        helpers:{
            section: hbs_sections()
        }
    }));
    app.set('view engine', 'hbs');
}
