var keys = require('./keys')
var request = require('request');
var natural = require('natural');
var classifier = new natural.BayesClassifier();
var docs = require('./classifiers.json');
var sentiment = require('sentiment');

var getHot = {
    url: 'https://api.reddit.com/r/wallstreetbets/hot',
    headers: {
        'User-Agent': 'wsbbot'
    }
}

classifier.events.on('trainedWithDocument', function (obj) {
   console.log(obj);
});

for(var k in docs) {
    classifier.addDocument(k, docs[k]);
}
classifier.train();


request(getHot, function(error, response, body) {
    var raw = JSON.parse(body);
    //console.log(JSON.stringify(raw, null, 2));
    for(var key in raw.data.children) {
        var obj = raw.data.children[key].data;
        var combined = obj.title + " " + obj.selftext;
        if(raw.data.children[key].data.selftext != undefined)
            console.log(classifier.classify(combined) + "\t" + sentiment(combined).comparative + "\t" + obj.title)
    }
});
