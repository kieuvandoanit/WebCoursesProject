const express = require('express');
const path = require("path");
const session = require('express-session');
const bodyParser = require('body-parser');


const app = express();
const port = 3000;

app.use(express.urlencoded({
    extended: true
}));

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie:{secure: false}  
  }));

app.use(express.static(path.join(__dirname,'public')));

app.use(express.urlencoded({
    extended:true
}));
app.use(express.json());

require("./middlewares/config.mdw")(app);
require("./middlewares/locals.mdw")(app);
require("./middlewares/routes.mdw")(app);

app.listen(port, () =>{
    console.log(`App listening at http://localhost:${port}`)
});
