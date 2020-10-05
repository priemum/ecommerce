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

router.post('/cart/checkout', (req, res) => {
    if(!req.session.cart)return res.redirect('/shop');
    var items = [];
    var price = 0;
    req.session.cart.forEach(cart => {
        var cart_partial = {
            item        : cart.product.name,
            item_id     : cart.product.product_id,
            quantity    : cart.quantity,
        }
        items.push(cart_partial);
        price = price + cart.product.price;
    });
    var datos = {
        name            : Utils.clean(req.body.name),
        last_name       : Utils.clean(req.body.last_name),
        address         : Utils.clean(req.body.address),
        email_address   : Utils.clean(req.body.email_address),
        phone           : Utils.clean(req.body.phone),
        order_notes     : Utils.clean(req.body.order_notes),
        codigo          : req.session.id,
        date            : new Date(),
        payment         : Utils.clean(req.body.payment),
        price           : price,
        items           : JSON.stringify(items),
        note            : Utils.clean(req.body.order_notes),
        apartment       : Utils.clean(req.body.apartment),
    };
    db.run(`INSERT INTO pedidos(items, mail, phone, price, name, lastname, date, dni, address, payment, note, codigo) VALUES('${datos.items}',
    '${datos.email_address}',
    '${datos.phone}',
    ${datos.price},
    '${datos.name}',
    '${datos.last_name}',
    '${datos.date}',
    '${datos.dni}',
    '${datos.address + ' ' + datos.apartment}',
    '${datos.payment}',
    '${datos.note}',
    '${datos.codigo}')`, (err) => {
        if(err){
            console.error(err.message);
            return res.status(500).end('Error while inserting the delivery. (ERR : 500)');
        }
        else {
            req.session.cart = [];
            Utils.renderTemplate(req, res, 'cart', {alert:'Producto en Orden! Puede contactarse con nosotros para ver el estado de su orden, o esperar a que nos contactemos para su envío! Muchas gracias por confiar en nosotros!', products : []});
        }
    });
});

router.get('/cart/checkout/callback', (req, res) => {
    var params = Utils.getParams(req, res);
    res.end(JSON.stringify(params));
});

exports = module.exports = router;