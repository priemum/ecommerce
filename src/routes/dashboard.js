const router = require('express').Router();

const Utils = require('../settings/utils.js');

router.get('/', Utils.Auth, (req, res) => {
	Utils.database().all(`SELECT * FROM pedidos`, (err, pedidos) => {
		if(err)return console.error(err.message);
		Utils.database().all(`SELECT * FROM products`, (err, productos) => {
		    Utils.renderDashboard(req, res, 'dashboard', {alert:'', pedidos, productos});
		})
	})
});

router.get('/productos/:id', Utils.Auth, (req, res) => {
	var id = Utils.clean(req.params.id);
	if(!id)return res.redirect('/admin/dashboard');
	if(isNaN(+id) && id !== 'create')return res.redirect('/admin/dashboard');
	if(id === 'create') {
		Utils.renderDashboard(req, res, 'create', {alert:''});
	}else {
		Utils.database().get(`SELECT * FROM products WHERE id = ${+id}`, (err, product) => {
			Utils.renderDashboard(req, res, 'edit', {product, alert:''});
		});
	}
});

router.get('/pedidos/:id', Utils.Auth, (req, res) => {
    Utils.renderDashboard(req, res, 'dashboard', {alert:''});
})

router.get('/stock/:id', Utils.Auth, (req, res) => {
    Utils.renderDashboard(req, res, 'dashboard', {alert:''});
})

router.get('/categorias/:id', Utils.Auth, (req, res) => {
    Utils.renderDashboard(req, res, 'dashboard', {alert:''});
})

exports = module.exports = router;