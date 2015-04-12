var express = require('express');
var router = express.Router();
var run = require('../run.js');
var file = require('read-file');
var colors = require('colors');

var obj;



router.get('/:symb', function(req, res, next) {
    res.render('stock', {symbol: req.params.symb});
});

router.get('/:symb/gen', function(req, res, next) {
    run.getChart(req.params.symb, function(data) {
        var string = "appendToData(" + JSON.stringify(data) + ");"
        res.send(string);
    });
});

router.get('/:symb/gen2', function(req, res, next) {
    file.readFile('public/js/ochart.js', function (err, data) {
        if (err) throw err;
        var send = data.replace("<<REPLACEME>>", req.params.symb);
        res.send(send);
    });
});

router.get('/:symb/twitter', function(req, res, next) {
    run.avgTwitter(req.params.symb, function(result) {
        res.send(result.toString());
    });
});

router.get('/:symb/rwsb', function(req, res, next) {
    run.avgWsb(req.params.symb, function(result) {
        res.send(result.toString());
    });
});

router.get('/:symb/investing', function(req, res, next) {
    run.avgInvesting(req.params.symb, function(result) {
        res.send(result.toString());
    });
});

module.exports = router;
