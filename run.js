var keys = require('./keys')
var request = require('request');
var natural = require('natural');
var classifier = new natural.LogisticRegressionClassifier();
var docs = require('./classifiers.json');
var sentiment = require('sentiment');
var yahooFinance = require('yahoo-finance');
var colors = require('colors');

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
            return string.red;
            break;
        case "buy":
            return string.green;
            break;
        case "volatile":
            return string.yellow;
            break;
        default:
            return string;
            break;
    }
}

exports.avgTwitter = function(symbol, callback) {
    var Twit = require('twit')
    var T = new Twit({
        consumer_key: keys.TWITTER_KEY
        , consumer_secret: keys.TWITTER_SECRET
        , access_token: keys.TWITTER_TOKEN
        , access_token_secret: keys.TWITTER_TOKEN_SECRET
    })
    T.get('search/tweets', { q: '$' + symbol + ' since:2011-11-11', count: 100 }, function(err, data, response) {
        var tweets = data.statuses;
        var total = 0;
        for(var k in tweets) {
            total += sentiment(tweets[k].text).comparative;
        }
        console.log(total/100);
        total /= 100;
        callback(total);
    });
}



exports.avgWsb = function(symbol, callback) {
    var getWsb = {
        url: 'https://api.reddit.com/r/wallstreetbets/search?q=' + symbol + '&restrict_sr=true',
        headers: {
            'User-Agent': 'wsbbot'
        }
    }
    request(getWsb, function(error, response, body) {
        var raw = JSON.parse(body);
        var sum = 0;
        var total = 0;
        for(var key in raw.data.children) {
            var obj = raw.data.children[key].data;
            var combined = obj.title + " " + obj.selftext;
            sum++;
            console.log(sentiment(combined));
            total += sentiment(combined.comparative);
        }
        callback(total/sum);
    });
};
