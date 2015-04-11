var express = require('express');
var router = express.Router();
var run = require('../run.js');
var file = require('read-file');

var obj;



router.get('/:symb', function(req, res, next) {
    res.render('stock');
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
        console.log(send);
        res.send(send);
    });
});

module.exports = router;
