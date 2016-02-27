/*
 * Shapes language module
 *
 * Collection of shape commands
 */

var session = require('../session'),
    utils = require('../utils'),
    debounceTwitter,
	debounceWeather,
	debounceRestaurants;

function get(queryType, queryText, callback) {
	switch (queryType) {
		case 'weather':
			getWeather(queryText, callback);
			break;
		case 'restaurants':
			getSushiRestaurants(queryText, callback);
			break;
		case 'twitter':
			getTwitterStats(queryText, callback);
			break;
	}
}

function getTwitterStats(user, callback) {
    var url = "http://query.yahooapis.com/v1/public/yql?q=SELECT%20*%20from%20html%20where%20url=%22http://twitter.com/" + user + "%22%20AND%20xpath=%22//li[contains(@class,%27ProfileNav-item--followers%27)]/a/span[@class=%27ProfileNav-value%27]|//li[contains(@class,%27ProfileNav-item--following%27)]/a/span[@class=%27ProfileNav-value%27]|//li[contains(@class,%27ProfileNav-item--tweets%27)]/a/span[@class=%27ProfileNav-value%27]%22&format=json"

    clearTimeout(debounceTwitter);
    debounceTwitter = setTimeout(function () {
        fetch(url)
        .then(function (r) {
            return r.json();
        })
        .then(function (page) {
            var tweets = page.query.results.span[0].content;
            var following = page.query.results.span[1].content;
            var followers = page.query.results.span[2].content;

            callback({
                tweets: tweets,
                following: following,
                followers: followers
            });
        });
    }, 500);
}

function getWeather(city, callback) {
    if (!city || !city.length) {
        return;
    }
    var queryBegin = 'select item.condition, wind, astronomy from weather.forecast where woeid in (select woeid from geo.places(1) where text="',
        queryEnd = '")',
        query = encodeURIComponent(queryBegin) + encodeURIComponent(city) + encodeURIComponent(queryEnd),
        env = 'store://datatables.org/alltableswithkeys',
        url = 'https://query.yahooapis.com/v1/public/yql?q=' + query + '&format=json&env=' + encodeURIComponent(env);

    clearTimeout(debounceWeather);
    debounceWeather = setTimeout(function () {
        window.fetch(url)
        .then(function (r) {
            return r.json();
        })
        .then(function (page) {
            var condition = page.query.results.channel.item.condition,
                wind = page.query.results.channel.wind,
                astronomy = page.query.results.channel.astronomy;
            delete condition.code;
            delete condition.date;
            callback({
                condition: condition,
                wind: wind,
                astronomy: astronomy
            });
        });
    }, 500);
}

module.exports = {
	get : get,
	getWeather: getWeather,
	getTwitterStats: getTwitterStats
};
