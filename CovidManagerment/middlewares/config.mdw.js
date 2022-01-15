const hbs_sections = require('express-handlebars-sections');
const { engine } =require('express-handlebars');
module.exports = (app) => {
    app.engine('.hbs', engine({
        defaultLayout: 'main.hbs',
        extname: '.hbs',
        layoutsDir: 'views/_layouts',
        partialsDir: 'views/_partials',
        helpers:{
            section: hbs_sections(),
            checked: (arr1, arr2) => {
                output = 'checked'
                if(arr1 === arr2){
                    return output;
                }
            },
            isActive_Info: (a, b) => {
                if(a === b){
                    return "Active";
                }
                return "Locked";
            },
            isActive_Class: (a, b) =>{
                if(a === b){
                    return "success";
                }
                return "danger";
            },
            selected: (a, b)=>{
                output: 'selected'
                if(a === b){
                    return output;
                }
            }
        }
    }));
    app.set('view engine', 'hbs');
}
