const router = require('express').Router();

const Utils = require('../settings/utils.js');

router.post('/', Utils.Auth, (req, res) => {
    Utils.renderTemplate(req, res, 'dashboard', {alert:''});
});

router.post('/productos', Utils.Auth, (req, res) => {
	res.end('Ready to post products');
})

router.post('/pedidos', Utils.Auth, (req, res) => {
	res.end('Ready to post pedidos');
})

router.post('/stock', Utils.Auth, (req, res) => {
	res.end('Ready to post stock');
})

router.post('/categorias', Utils.Auth, (req, res) => {
	res.end('Ready to post categorias');
})

exports = module.exports = router;