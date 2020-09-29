const router = require('express').Router();

const Utils = require('../settings/utils.js');

router.get('/', Utils.Auth, (req, res) => {
	Utils.database().all(`SELECT * FROM pedidos`, (err, pedidos) => {
		if(err)return console.error(err.message);
	    Utils.renderDashboard(req, res, 'dashboard', {alert:''});
	})
});

router.get('/productos', Utils.Auth, (req, res) => {
    Utils.renderDashboard(req, res, 'dashboard', {alert:''});
})

router.get('/pedidos', Utils.Auth, (req, res) => {
    Utils.renderDashboard(req, res, 'dashboard', {alert:''});
})

router.get('/stock', Utils.Auth, (req, res) => {
    Utils.renderDashboard(req, res, 'dashboard', {alert:''});
})

router.get('/categorias', Utils.Auth, (req, res) => {
    Utils.renderDashboard(req, res, 'dashboard', {alert:''});
})

exports = module.exports = router;