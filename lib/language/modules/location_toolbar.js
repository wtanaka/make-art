/*
 * Location toolbar language module
 *
 * Collection of location toolbar commands
 */

var session = require('../session'),
    utils = require('../utils'),
    id = 0;

function createToolbar(callback) {

    var toolbarContainer = window.document.createElement('div'),
        text = window.document.createElement('p'),
        toolbar_input = createInput(),
        getInputValue = function () {
            console.log(this.value);
            return this.value;
        },
        toolbar_button = createButton('Set Location', callback, toolbar_input);


    text.style.color = 'white';
    text.innerHTML = 'Location';
    text.style.margin = '10px 10px';

    text.style.display = toolbar_input.style.display = toolbar_button.style.display = 'inline-block';

    toolbarContainer.setAttribute('id', 'toolbar-container-' + id);
    toolbarContainer.style.position = 'absolute';
    toolbarContainer.style.height = '60px';
    toolbarContainer.style.background = 'gray';
    toolbarContainer.style.width = '100%';
    toolbarContainer.style.textAlign = 'center';


    toolbarContainer.appendChild(text);
    toolbarContainer.appendChild(toolbar_input);
    toolbarContainer.appendChild(toolbar_button);
    // window.document.getElementById('uiDisplay').appendChild(toolbarContainer);
    window.document.getElementById('htmlDisplay').appendChild(toolbarContainer);



    // var inp = window.document.createElement('button');
    // inp.innerHTML = name;
    // inp.setAttribute('id', 'button-' + id);
    // id++;
    // window.document.getElementById('htmlDisplay').appendChild(inp);
    // var rect = inp.getBoundingClientRect(),
    //     pos = utils.scaleTo(session.pos.x, session.pos.y, session.size);
    // inp.style.position = 'absolute';
    // inp.style.top = pos.y - (rect.height) + 'px';
    // inp.style.left = pos.x - (rect.width / 2) + 'px';
    // inp.style.zIndex = '1';
    // function onClick() {
    //     (callback || function () {}).call(inp);
    // }
    // inp.onclick = onClick;
    // inp.ontap = onClick;
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

function createButton(name, callback, input) {
    var inp = window.document.createElement('button');
    inp.innerHTML = name;

    var rect = inp.getBoundingClientRect(),
        pos = utils.scaleTo(session.pos.x, session.pos.y, session.size);
    inp.style.zIndex = '1';
    inp.style.margin = '10px 10px';
    function onClick() {
        console.log('callback is ', callback);
        (callback || function () {}).call(inp, input.value);
    }
    inp.onclick = onClick;
    inp.ontap = onClick;

    return inp;
}

function createInput(name) {
    var inp = window.document.createElement('input');
    inp.setAttribute('type', 'text');
    inp.style.margin = '10px 10px';
    window.document.getElementById('htmlDisplay').appendChild(inp);
    var rect = inp.getBoundingClientRect(),
        pos = utils.scaleTo(session.pos.x, session.pos.y, session.size);
    id++;

    return inp;
}

module.exports = {
    createToolbar: createToolbar,
    reset: reset
};
