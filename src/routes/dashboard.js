const router = require('express').Router();

const Utils = require('../settings/utils.js');

router.get('/', Utils.Auth, (req, res) => {
	Utils.database().all(`SELECT * FROM pedidos`, (err, pedidos) => {
		Utils.database().all(`SELECT * FROM products`, (err, productos) => {
			Utils.database().all(`SELECT * FROM category`, (err, categories) => {
			    Utils.renderDashboard(req, res, 'dashboard', {alert:'', pedidos, productos, categories});
			})
		})
	})
});

router.get('/productos/:id', Utils.Auth, (req, res) => {
	var id = Utils.clean(req.params.id);
	if(!id)return res.redirect('/admin/dashboard');
	if(isNaN(+id) && id !== 'create')return res.redirect('/admin/dashboard');
	if(id === 'create') {
		Utils.database().all(`SELECT * FROM category`, (err, categories) => {
			Utils.renderDashboard(req, res, 'create', {alert:'', categories});
		})
	}else {
		Utils.database().get(`SELECT * FROM products WHERE id = ${+id}`, (err, product) => {
			Utils.database().all(`SELECT * FROM category`, (err, categories) => {
				Utils.renderDashboard(req, res, 'edit', {product, alert:'', categories});
			});
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

router.get('/productos/delete/:id', Utils.Auth, (req, res) => {
	var id = +Utils.clean(req.params.id);
	Utils.database().run(`DELETE FROM products WHERE id = ${id}`, (err) => {
		res.redirect('/admin/dashboard');
	});
})

exports = module.exports = router;