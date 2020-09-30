const router = require('express').Router();

const Utils = require('../settings/utils.js');

const fs = require('fs');

router.post('/', Utils.Auth, (req, res) => {
    Utils.renderTemplate(req, res, 'dashboard', {alert:''});
});

router.post('/productos/:id', Utils.Auth, (req, res) => {
	var id = Utils.clean(req.params.id);
	if(!id)return res.redirect('/admin/dashboard');
	if(isNaN(+id) && id !== 'create')return res.redirect('/admin/dashboard');
	if(id === 'create') {
		var datos = {
			name 		: Utils.clean(req.body.name),
			description : Utils.clean(req.body.description),
			product_id 	: Utils.clean(req.body.product_id),
			price 		: +Utils.clean(req.body.price),
			stock 		: +Utils.clean(req.body.stock),
		}
		if(req.files){
			datos.image = req.files.image;
		}
		if(isNaN(datos.price) || isNaN(datos.stock))return res.redirect('/admin/dashboard/productos/create');
		if(datos.image){
			Utils.database().run(`INSERT INTO products(name, description, product_id, price, stock, image) VALUES('${datos.name}','${datos.description}','${datos.product_id}',${datos.price},${datos.stock}, '${datos.image.name}')`, (err) => {
				Utils.database().get(`SELECT * FROM products WHERE product_id = '${datos.product_id}' and name = '${datos.name}' and price = ${datos.price}`, (err, row) => {
					if(err)return console.error(err.message);
					if(row){
			            fs.readdir(`${process.cwd()}/src/public/products_images/${row.id}`, (err, files) => {
	                        if (err) {
	                            if (err.code === "ENOENT") {
	                                fs.mkdirSync(`${process.cwd()}/src/public/products_images/${row.id}`);
	                                archivos = [];
	                            }
	                        }
			                datos.image.mv(`${process.cwd()}/src/public/products_images/${row.id}/${datos.image.name}`, err => {
			                    if (err) return res.status(500).send({
			                        message: err
			                    })
			                    return res.redirect('/admin/dashboard');
			                })
			            })
					}
				})
			})
		}else {
			Utils.database().run(`INSERT INTO products(name, description, product_id, price) VALUES('${datos.name}','${datos.description}',${datos.product_id},${datos.price})`)
			res.redirect('/admin/dashboard');
		}
	}else {
		var datos = {
			name 		: Utils.clean(req.body.name),
			description : Utils.clean(req.body.description),
			product_id 	: Utils.clean(req.body.product_id),
			price 		: +Utils.clean(req.body.price),
			discount 	: +Utils.clean(req.body.discount),
			stock 	: +Utils.clean(req.body.stock),
		}
		if(req.files){
			datos.image = req.files.file;
		}
		if(isNaN(datos.price) || isNaN(datos.discount) || isNaN(datos.stock))return res.redirect('/admin/dashboard/productos/'+id);
		if(datos.image){
			fs.readdir(`${process.cwd()}/src/public/products_images/${id}`, (err, files) => {
				if(err){
					if(err.code === "ENOENT"){
						fs.mkdirSync(`${process.cwd()}/src/public/products_images/${id}`);
					}
				}
				datos.image.mv(`${process.cwd()}/src/public/products_images/${id}/${datos.image.name}`, err => {
					if(err)return res.status(500).send({message:err});
					return res.redirect('/admin/dashboard');
				})
			})
			Utils.database().run(`UPDATE products SET image = '${datos.image.name}',
			name = '${datos.name}',
			description = '${datos.description}',
			product_id = '${datos.product_id}',
			price = ${datos.price},
			stock = ${datos.stock},
			discount = ${datos.discount} WHERE id = ${id}`)
		}else {
			Utils.database().run(`UPDATE products SET name = '${datos.name}',
			description = '${datos.description}',
			product_id = '${datos.product_id}',
			price = ${datos.price},
			stock = ${datos.stock},
			discount = ${datos.discount} WHERE id = ${id}`)
			res.redirect('/admin/dashboard');
		}
	}
});

router.post('/pedidos', Utils.Auth, (req, res) => {
	res.end('Ready to post pedidos');
});

router.post('/categorias', Utils.Auth, (req, res) => {
	res.end('Ready to post categorias');
});

exports = module.exports = router;