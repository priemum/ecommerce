const Utils = require('../settings/utils');

const router = require('express').Router();

const bodyParser = require('body-parser');

const path = require("path");

const fs = require('fs');

router.use(bodyParser.urlencoded({ extended: false }));

router.get('/', (req, res) => {
	Utils.database().all(`SELECT * FROM products WHERE visible = true`, (err, rows) => {
		res.status(200).send(JSON.stringify(rows));
		Utils.database().close();
	})
})

router.post('/', (req, res) => {
	res.setHeader('Content-Type', 'text/plain');
	if(!req.body.dir)res.end('No dir Sent');
	var dir = path.resolve(`${process.cwd()}${path.sep}src${path.sep}public${path.sep}products_images${path.sep}${req.body.dir}`);
	fs.readdir(dir, (err, archivos) => {
		if(err){
			if(err.code === "ENOENT"){
				fs.mkdirSync(`${process.cwd()}${path.sep}src${path.sep}public${path.sep}products_images${path.sep}${req.body.dir}`);
				archivos = [];
			}
		}
		console.log(archivos);
		return res.end(JSON.stringify(archivos));
	})
})

exports = module.exports = router;