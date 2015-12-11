var Twit        = require('twit');
var tracery		= require('tracery-grammar')

var T = new Twit({
    consumer_key:         '16IVW3Hfj40KVXsS7rW0hJNvZ',
    consumer_secret:      'QZpmZuCrQ2m8wBjPif9zjlCETGIlRc8CkrDA1vt5wpODtr0bNw',
    access_token:         '4398409492-7R6j6Xr4MJaxhBmWRpyQ5e3rmpjlKIbD9GIon5i',
    access_token_secret:  '70wva25twT7xngyKgrWM2u63I6dcl6Y3VUNUdWiGasssu'
});

var grammar = tracery.createGrammar(require('./grammar.json')); //loads json object with grammar from file


//capitalization function
String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

//stream of tweet mentions
var stream = T.stream('statuses/filter', {
	track: ['@queertheorybot']
});


stream.on('tweet', function(tweet) {
	var response = grammar.flatten('#question#').capitalize();

	while (response.length > 140) {
		response = grammar.flatten('#origin#');
	};

	T.post('statuses/update', {
		status: '@' + tweet.user.screen_name + ' ' + response,
		in_reply_to_status_id: tweet.id_str
	}, 
	function (err, data, response) {
		console.log(data);
	});	

});

function postTweet() {
	//generates and posts a new tweet
	var tweet = grammar.flatten('#origin#');

	while (tweet.length > 140) {
		tweet = grammar.flatten('#origin#');
	};

	T.post('statuses/update', { status: tweet }, function(err, data, response) {
		console.log(data);
	});

}


postTweet();

setInterval(postTweet,1000*60*15);
