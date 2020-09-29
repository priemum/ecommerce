const router = require('express').Router();

const Utils = require('../settings/utils.js');

const crypto = require('crypto');

router.use('/dashboard', require('./dashboard'));

router.use('/dashboard', require('./dashboard-post'));

router.get('/login', Utils.notAuth, (req, res) => {
    Utils.renderTemplate(req, res, 'login', {alert:''});
})

router.post('/login', Utils.notAuth, (req, res) => {
    var mail_login = Utils.clean(req.body.mail);
    var password = Utils.clean(req.body.password);
    if (mail_login && password) {
        var hash_password = crypto.createHmac('sha1', 'abcdeg').update(password).digest('hex');
        var query = 'SELECT * FROM users WHERE email = "' + mail_login + '" AND password = "' + hash_password + '"';
        Utils.database().get(query, (err, rows) => {
            if (rows) {
                req.session.loggedin = true;
                req.session.username = rows.username;
                req.session.email = mail_login;
                req.session.admin = rows.admin;
                req.session.user_id = rows.id;
                res.redirect('/admin/dashboard');
            } else {
                Utils.renderTemplate(req, res, 'login', {alert:'Email o Contraseña Incorrecta'});
            }
            res.end();
        });
    } else {
        Utils.renderTemplate(req, res, 'login', {alert:'Inserte Email y Contraseña'});
        res.end();
    }
});

router.get('/logout', Utils.Auth, (req, res) => {
    req.session.loggedin = false;
    req.session.username = null;
    req.session.email = null;
    req.session.user_id = null;
    req.session.admin = null;
    res.redirect('/');
});

router.get('/register', Utils.Auth, Utils.Admin, (req, res) => {
    Utils.renderTemplate(req, res, 'register', {alert:''});
});

router.post('/register', Utils.Auth, Utils.Admin, (req, res) => {
    var username_register = Utils.clean(req.body.username);
    var email_register = Utils.clean(req.body.email);
    var password_register = crypto.createHmac('sha1', 'abcdeg').update(Utils.clean(req.body.password)).digest('hex');
    var phone_register = Utils.clean(req.body.phone);
    var dni_register = Utils.clean(req.body.dni);
    var name_register = Utils.clean(req.body.name);
    var lastname_register = Utils.clean(req.body.lastname);
    Utils.database().get(`SELECT * FROM users WHERE email = '${email_register}'`, (err, rows) => {
        if (err) return console.error(err.message);
        if (rows) return Utils.renderTemplate(req, res, 'register', {alert:'Ya hay una cuenta registrada con ese email'});
            if (err) return console.error(err.message);
            Utils.database().run(`INSERT INTO users(username, email, password, admin, telefono, dni, name, lastname) VALUES('${username_register}', '${email_register}', '${password_register}', '0', '${phone_register}', '${dni_register}', '${name_register}', '${lastname_register}')`)
            Utils.renderTemplate(req, res, 'register', {alert:'Cuenta creada con éxito'});
    });
});

exports = module.exports = router;