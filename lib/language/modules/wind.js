/*
 * Location toolbar language module
 *
 * Collection of location toolbar commands
 */

var session = require('../session'),
    utils = require('../utils'),
    WindSimulator = require('../../wind'),
    el,
    sim;

function createWind(speed, direction) {

    if (!el) {
        el = window.document.createElement('div');
        el.setAttribute('id', 'wind');
        window.document.getElementById('htmlDisplay').appendChild(el);
        sim = WindSimulator('wind', session.size.width, session.size.height);
    }
    el.style.display = 'block';
    sim.resizeCanvas(session.size.width, session.size.height);
    sim.angle = direction / 360 * 6;
    sim.speed = speed;
}

function reset() {
    if (el) {
        el.style.display = 'none';
    }
}

module.exports = {
    createWind: createWind,
    reset: reset
};
