const router = require('express').Router();

router.use('/products', require('./products'));

router.get('/', (req, res) => {

})

router.post('/', (req, res) => {

})

exports = module.exports = router;