var keys = require('./keys')
var request = require('request');
var natural = require('natural');
var classifier = new natural.LogisticRegressionClassifier();
var docs = require('./classifiers.json');
var sentiment = require('sentiment');
var yahooFinance = require('yahoo-finance');
var colors = require('colors');
var utf8 = require('utf8');

classifier.events.on('trainedWithDocument', function (obj) {
   console.log(obj);
});

for(var k in docs) {
    classifier.addDocument(k, docs[k]);
}
classifier.train();

var getHot = {
    url: 'https://api.reddit.com/r/wallstreetbets/hot',
    headers: {
        'User-Agent': 'wsbbot'
    }
}


request(getHot, function(error, response, body) {
    var raw = JSON.parse(body);
    //console.log(JSON.stringify(raw, null, 2));
    for(var key in raw.data.children) {
        var obj = raw.data.children[key].data;
        var combined = obj.title + " " + obj.selftext;
        if(raw.data.children[key].data.selftext != undefined)
            console.log(highlight(classifier.classify(combined)) + "\t" + sentiment(combined).comparative + "\t" + obj.title)
    }
    console.log(highlight("sell"));
});

var highlight = function(string) {
    switch(string) {
        case "sell":
            return utf8.encode(string.red);
            break;
        case "buy":
            return utf8.encode(string.green);
            break;
        case "volatile":
            return utf8.encode(string.yellow);
            break;
        default:
            return string;
            break;
    }
}

yahooFinance.snapshot({
    symbol: 'CSS',
    fields: ['s', 'n', 'd1', 'l1', 'y', 'r'],
}, function (err, snapshot) {
    console.log(err);
    console.dir(snapshot);
});

yahooFinance.historical({
  symbol: 'TSLA',
  from: '2015-04-06',
  to: '2015-04-10'
}, function (err, quotes) {
    console.log(quotes);
});
