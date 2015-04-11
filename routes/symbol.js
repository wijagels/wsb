var express = require('express');
var router = express.Router();
var run = require('../run.js');

router.get('/', function(req, res, next) {
    res.render('stock');
});

router.get('/:symb', function(req, res, next) {
  res.send(req.params.symb);
});

module.exports = router;
