/*
 * Location toolbar language module
 *
 * Collection of location toolbar commands
 */

var session = require('../session'),
    utils = require('../utils'),
    WindSimulator = require('../../wind'),
    id = 0;

function createWind(speed, direction) {

    var toolbarContainer = window.document.createElement('div');
    toolbarContainer.setAttribute('id', 'wind-' + id);
    window.document.getElementById('htmlDisplay').appendChild(toolbarContainer);
    var sim = WindSimulator('wind-' + id, session.size.width, session.size.height);
    sim.angle = direction / 360 * 6;
    sim.speed = speed;
    id++;
}

function reset() {
    for (var i = 0; i <= id; i++) {
        var el = document.getElementById('wind-' + i);
        if (el) {
            el.remove();
        }
    }
    id = 0;
}

module.exports = {
    createWind: createWind,
    reset: reset
};
