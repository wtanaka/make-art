/*
 * Location toolbar language module
 *
 * Collection of location toolbar commands
 */

var session = require('../session'),
    utils = require('../utils'),
    id = 0;

function createToolbar(name, callback) {

    var toolbarContainer = window.document.createElement('div');

    toolbarContainer.innerHTML = '<form>' +
                                    '<p style="color: white; margin: 10px; display: inline-block;font-size:1.2em">' + name + '</p>' +
                                    '<input type="text" style="margin: 10px; display: inline-block;flex:1">' +
                                    '<button style="z-index: 1; margin: 10px; display: inline-block;" type="submit">Set ' + name + '</button>' +
                                '</form>';

    toolbarContainer.setAttribute('id', 'toolbar-container-' + id);
    toolbarContainer.style.position = 'absolute';
    toolbarContainer.style.height = '60px';
    toolbarContainer.style.background = 'gray';
    toolbarContainer.style.width = '100%';
    toolbarContainer.style.textAlign = 'center';

    if (name === 'Location') {
        fetch('http://paul-kano-geoip.herokuapp.com/city')
        .then(function (r) { return r.json(); })
        .then(function (res) {
            toolbarContainer.querySelector('input').setAttribute('value', res.City.Names.en);
            toolbarContainer.dispatchEvent(new Event('updateLocation'));
        });
    }

    window.document.getElementById('uiDisplay').appendChild(toolbarContainer);
    id++;
    function updateLocation (e) {
        e.preventDefault();
        callback(toolbarContainer.querySelector('input').value);
     }

    toolbarContainer.querySelector('form').onsubmit = updateLocation;
    toolbarContainer.querySelector('form').style.display = 'flex';
    toolbarContainer.querySelector('form').style.flexDirection = 'row';
    toolbarContainer.querySelector('form').style.alignItems = 'center';
    toolbarContainer.addEventListener('updateLocation', updateLocation);

}

function reset() {
    for (var i = 0; i <= id; i++) {
        var el = document.getElementById('toolbar-container-' + i);
        if (el) {
            document.getElementById('htmlDisplay').removeChild(el);
        }
    }
    id = 0;
}

module.exports = {
    createToolbar: createToolbar,
    reset: reset
};
