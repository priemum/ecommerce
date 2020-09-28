const Utils = require('./utils.js');

exports.findAllProducts = () => {
	Utils.database().get(`SELECT * FROM products WHERE visible = true`, (err, rows) => {
		Utils.database().close();
		return rows;
	})
}

exports.insertProduct = () => {
	Utils.database().close();
	return 'here';
}