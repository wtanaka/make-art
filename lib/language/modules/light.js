var session = require('../session'),
    space = require('./space'),
    setters = require('./setters'),
    text = require('./text'),
    paths = require('./paths'),
    utils = require('../utils'),
    colors = require('./colors'),
    shapes = require('./shapes'),
    q = require('q');

// The ID of the extension we want to talk to.
var editorExtensionId = "ocpmijjkiedjemnokhpajnpmeclhbfhf";

function lightOn (element) {
    var column = element[0],
        row    = element[1];

    console.log('lightOn', column, row);

    led (column, row);
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

function sendMessageToChromeApp(message) {

    console.log('message', message);

    var lines = message.split('\n'),
        msg_list = [],
        command,
        column,
        row,
        l,
        line,
        msg;

    for (line in lines) {

        console.log('line', lines[line]);

        l = lines[line].split(' ');

        if (l[0]) {
            command = l[0];
        }

        if (l[1]) {
            column = l[1].substring(0,1);
            row = l[1].substring(1);
        }

        msg = {
            command: command,
            column: column,
            row: row
        };

        msg_list.push(msg);
    }

    console.log(msg_list);

    chrome.runtime.sendMessage(editorExtensionId, {commands: msg_list},
    function(response) {
        if (response) {
            if (!response.success)
            handleError(url);
        }
    });

}

function getLightBoardCode() {

    var rawFile = new XMLHttpRequest(),
        deferred = q.defer();

    rawFile.open('GET', './assets/lightBoardCode.txt', false);
    rawFile.onreadystatechange = function () {
        if (rawFile.readyState === 4) {
            if (rawFile.status === 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;
                deferred.resolve(allText);
            }
        }
    }
    rawFile.send(null);
    return deferred.promise;
}

module.exports = {
    getLightBoardCode: getLightBoardCode,
    lightOn  : lightOn,
    sendMessageToChromeApp: sendMessageToChromeApp
};
