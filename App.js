// We import modules.
const url = require("url");
const path = require("path");
const express = require("express");
const session = require("express-session");
const fileUpload = require("express-fileupload");   
const fs = require('fs');
const ejs = require("ejs");
const bodyParser = require("body-parser");
const config = require('./src/settings/config');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
var EmailCtrl = require('./src/settings/nodemailer');
const Utils = require('./src/settings/utils');
const db = Utils.database();
console.log(db);

// We instantiate express app and the session store.
const app = express();

var server = require('http').Server(
    app);

var io = require('socket.io')(server);


const MemoryStore = require("memorystore")(session);

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));



app.use(bodyParser.urlencoded({
    extended: true
}));


app.use(bodyParser.json());


app.use(fileUpload());


app.use(express.static('src'));

app.use('/admin', require('./src/routes/admin'));

app.use('/', require('./src/routes/shop'));

app.use('/api/products', require('./src/api/products'));

app.get('/', (req, res) => {
    db.all('SELECT * FROM products ORDER BY pedidos LIMIT 7', (err, rows) => {
        if (err) return console.error(err.message);
            Utils.database().close();
            Utils.renderTemplate(req, res, 'index', {rows, alert:''})
        });
});

app.get('/index', (req, res) => {
    res.redirect('/');
});

app.use((req, res) => {
    res.status(404).render(path.join(__dirname + '/src/components/ejs' + '/404.ejs'), {
        req,
        res
    });
});

app.listen(8080, null, null, () => console.log(`Server is up and running on port ${8080}.`));
