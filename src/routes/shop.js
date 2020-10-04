const router = require('express').Router();

const Utils = require('../settings/utils.js');

const db = Utils.database();

var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

const stripe = require('stripe')('sk_test_51HXa8NI4a9iYksByC4qP3Xm8YYVkUMDN7BHU6SSSYmA1j6UAihDbONLWkyjMMVEtp3cN47c7nXieVHRx90EirpGO00IUGQG9Em');

router.get('/shop', (req, res) => {
    db.all('SELECT * FROM products', (err, rows) => {
        if (err) return console.error(err.message);
        db.all('SELECT * FROM category', (err, categories) => {
            var prices = {
                min : 1000000000,
                max : 0
            };
            rows.forEach(r => {
                if(r.price < prices.min)prices.min = r.price;
                if(r.price > prices.max)prices.max = r.price;
            })
            Utils.renderTemplate(req, res, 'shop', {rows, categories, alert:'', prices});
        })
    });
});

router.get('/shop/:product', (req, res) => {
    var product = +Utils.clean(req.params.product);
    if(isNaN(product))return res.redirect('/shop');
    db.get(`SELECT * FROM products WHERE id = ${product}`, (err, product) => {
        if(!product)return res.redirect('/shop');
        Utils.renderTemplate(req, res, 'shop_single', {product, alert: ''});
    })
})

router.post('/shop/cart/:product', (req, res) => {
    var product = +Utils.clean(req.params.product);
    var quantity = +Utils.clean(req.body.quantity);
    if(isNaN(product))return res.redirect('/shop');
    if(isNaN(quantity))return res.redirect('/shop/'+product);
    db.get(`SELECT * FROM products WHERE id = ${product}`, (err, product) => {
        if(!product)return res.redirect('/shop');
        if(req.session.cart)req.session.cart.push({'product' : product, 'quantity' : quantity});
        else req.session.cart = [{'product' : product, 'quantity' : quantity}];
        res.redirect('/cart');
    });
});

router.get('/shop/cart/delete/:item', (req, res) => {
    var item = +Utils.clean(req.params.item);
    if(isNaN(item))return res.redirect('/cart');
    if(item === undefined || item === null)return res.redirect('/cart');
    if(req.session.cart){
        if(!req.session.cart[item])return res.redirect('/cart');
        req.session.cart.splice(item, 1);
        res.redirect('/cart');
    }else res.redirect('/cart');
});

router.get('/cart', (req, res) => {
    var products = [];
    if(req.session.cart)products = req.session.cart;
    Utils.renderTemplate(req, res, 'cart', {products, alert:''});
});

router.get('/cart/checkout', (req, res) => {
    if(!req.session.cart)return res.redirect('/shop');
    if(req.session.cart.length <= 0)return res.redirect('/shop');
    var products = req.session.cart;
    Utils.renderTemplate(req, res, 'checkout', {alert:'', products});
});



router.get('/cart/checkout/callback', (req, res) => {
    var params = Utils.getParams(req, res);
    res.end(JSON.stringify(params));
});

exports = module.exports = router;