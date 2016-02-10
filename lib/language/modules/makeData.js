var jquery = require('jquery');

/*
 * Get data from an API
 *
 * @param {String} type
 * @param {String} query
 * @return void
 */


weatherData = {
	london: {
		place: 'London',
		temperature: 8,
		description: 'Cloudy'
	},
	'palo alto': {
		place: 'Palo Alto',
		temperature: 14,
		description: 'Sunny'
	},
	'cupertino': {
		place: 'cupertino',
		temperature: 13,
		description: 'Sunny'
	}
};

// London
var responseLondon = jquery.getJSON('http://api.openweathermap.org/data/2.5/weather?q=' + 'london' + '&APPID=1691a75f2882233290efe7dccf49459e', function () {
	weatherData.london = {
		place: responseLondon.responseJSON.name,
		temperature: Math.floor(responseLondon.responseJSON.main.temp - 273.15 + .5),
		description: responseLondon.responseJSON.weather[0].main
	}
});

// Palo Alto
var responsePaloAlto = jquery.getJSON('http://api.openweathermap.org/data/2.5/weather?q=' + 'palo alto' + '&APPID=1691a75f2882233290efe7dccf49459e', function () {
	weatherData['palo alto'] = {
		place: responsePaloAlto.responseJSON.name,
		temperature: Math.floor(responsePaloAlto.responseJSON.main.temp - 273.15 + .5),
		description: responsePaloAlto.responseJSON.weather[0].main
	}
});

// Mountain View
var responseCupertino = jquery.getJSON('http://api.openweathermap.org/data/2.5/weather?q=' + 'cupertino' + '&APPID=1691a75f2882233290efe7dccf49459e', function () {
	weatherData.cupertino = {
		place: responseCupertino.responseJSON.name,
		temperature: Math.floor(responseCupertino.responseJSON.main.temp - 273.15 + .5),
		description: responseCupertino.responseJSON.weather[0].main
	}
});

function get(type, query) {
	query = query.toLowerCase();
	switch (type) {

	case 'weather':
		if (weatherData[query]) {
			return weatherData[query];
		} else {
			return {
				place: 'unknown',
				temperature: 0,
				description: 'unknown'
			}
		};
		break;


	case 'image':
		var canvas = document.getElementsByTagName('canvas')[0];
		var address = '';
		switch (query) {
			case 'london':
				address = 'http://localhost:3000/assets/data/london.jpg';
				break;
			case 'palo alto':
				address = 'http://localhost:3000/assets/data/palo-alto.jpg';
				break;
			case 'cupertino':
				address = 'http://localhost:3000/assets/data/cupertino.jpg';
				break;
			default:
				address = '';
				break;
		}
		canvas.style.background = "url('" + address + "') no-repeat center center";
		canvas.style.backgroundSize = 'cover';
		canvas.style.webkitBackgroundSize = 'cover';
		canvas.style.mozBackgroundSize = 'cover';
		canvas.style.oBackgroundSize = 'cover';
		canvas.style.msBackgroundSize = 'cover';
		console.log(canvas);
		return null;
	}
}

module.exports = {
	get: get
}
