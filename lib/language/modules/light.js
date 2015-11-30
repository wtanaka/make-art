var session = require('../session'),
    space = require('./space'),
    setters = require('./setters'),
    text = require('./text'),
    paths = require('./paths'),
    utils = require('../utils'),
    colors = require('./colors'),
    shapes = require('./shapes');

// The ID of the extension we want to talk to.
var editorExtensionId = "kano-connect-v1";

function lightOn (element) {
    var column = element[0],
        row    = element[1];

    console.log('lightOn', column, row);

    led (column, row);

    // Make a simple request:
    chrome.runtime.sendMessage(editorExtensionId, {command: 'lightOn(' + column + ',' + row + ')'},
    function(response) {
        if (response) {
            if (!response.success)
            handleError(url);
        }
    });
}

function led (x, y, light) {
    var offLED, offSolder, onLED, onSolder;
    if (light === void 0 || light === true) {
      light = 7;
    }
    if (light === false) {
      light = 0;
    }
    offLED = '#7f7c78';
    onLED = '#dedbc5';
    offSolder = '#858282';
    onSolder = '#ffffff';
    x = x * 49 + 66;
    y = y * 28.25 + 99;
    space.moveTo(x, y);
    setters.color(colors.mix(offLED, onLED, (light / 7) * 100 + .001));
    shapes.rectangle(18, 15);
    setters.color(colors.mix(offSolder, onSolder, (light / 7) * 100 + .001));
    space.move(0, 7.5);
    shapes.arc(7.5, 1.5, .5, true);
    space.move(15);
    return shapes.arc(7.5, .5, 1.5, true);
}

module.exports = {
    lightOn  :lightOn
};
