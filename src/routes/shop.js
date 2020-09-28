const router = require('express').Router();

const Utils = require('../settings/utils.js');

router.get('/shop', (req, res) => {
    Utils.database().all('SELECT * FROM products', (err, rows) => {
        if (err) return console.error(err.message);
        Utils.renderTemplate(req, res, 'shop', {rows, alert:''})
    });
});


router.post('/shop', (req, res) => {
    var mail_login = Utils.clean(req.body.mail);
    var password = Utils.clean(req.body.password);
    if (mail_login && password) {
        var hash_password = crypto.createHmac('sha1', 'abcdeg').update(password).digest('hex');
        var query = 'SELECT * FROM users WHERE email = "' + mail_login + '" AND password = "' + hash_password + '"';
        db.get(query, (err, rows) => {
            if (rows) {
                req.session.loggedin = true;
                req.session.username = rows.username;
                req.session.email = mail_login;
                req.session.admin = rows.admin;
                req.session.user_id = rows.id;
                res.redirect('/admin/dashboard');
            } else {
                Utils.renderTemplate(req, res, 'login', {alert:''});
            }
            res.end();
        });
    } else {
        Utils.renderTemplate(req, res, 'login', {alert:'Inserte Email y Contraseña'});
        res.end();
    }
});

exports = module.exports = router;