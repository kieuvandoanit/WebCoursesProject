require('dotenv').config()
const express = require('express');
const path = require("path");
const https = require('https');
const fs = require('fs');
const session = require('express-session');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken')


const app = express();
const port = 3001;

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


const sslServer = https.createServer(
    {
    key: fs.readFileSync(path.join(__dirname, 'key', 'key.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'key', 'cert.pem')),
    requestCert: false,
    rejectUnauthorized: false
    },
    app);

sslServer.listen(3443, ()=>{
    console.log('Secure server on https://localhost:3443');
})
app.listen(port, () =>{
    console.log(`App listening at http://localhost:${port}`)
});
