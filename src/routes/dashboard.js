const router = require('express').Router();

const Utils = require('../settings/utils.js');

router.get('/', Utils.Auth, (req, res) => {
    Utils.renderTemplate(req, res, 'dashboard', {alert:''});
})

exports = module.exports = router;