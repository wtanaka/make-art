/*jshint browser: true, unused: vars*/
/*global chrome, Mustache*/

"use strict";

var testLine = [0x55, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07],
    allOff = [0x55, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
    colMap = {
        a: 1,
        b: 2,
        c: 3,
        d: 4,
        e: 5,
        f: 6,
        g: 7,
        h: 8,
        i: 9
    },
    line,
    connectDeviceBtn = document.getElementById("connect-device"),
    sendSignalBtn = document.getElementById("send-signal"),
    connectionSelectorContainer = document.getElementById("conn-selector"),
    connectionSelectorTmpl = document.getElementById("conn-selector-tmpl").innerHTML,
    connectedDevicesList = document.getElementById("conn-devs-list"),
    connectedDevicesListTmpl = document.getElementById("conn-devs-list-tmpl").innerHTML,
    signal = 'n',
    connections = {},
    devices,
    connectedDevices = [],
    address = '',
    /**
     * Functions to update the UI
     * @type {Object}
     */
    UI = {
        writeToMessage: function (msg)  {
            var container = document.getElementById("console"),
                doc = container.innerHTML;
            container.innerHTML = doc + "<br/>&gt; " + msg;
            container.scrollTop = 5000;

        },
        updateConnectedDevices: function (devices) {
            connectedDevicesList.innerHTML = Mustache.render(connectedDevicesListTmpl, {devices: devices});
        },
        updateFoundDevices: function (devices) {
            connectionSelectorContainer.innerHTML = Mustache.render(connectionSelectorTmpl, {devices: devices});
        }
    };
chrome.runtime.onMessageExternal.addListener(
    function (request, sender, sendResponse) {
        line = allOff.slice(0);

        request.commands.forEach(function (c) {
            var index;
            UI.writeToMessage("<b>Command</b> " + c.command + '(' + c.column + ', ' + c.row + ')' );
            if (c.command === 'lightOn') {
                index = colMap[c.column] + (c.row - 1) * 9;
                line[index] = 0x07;
            }
        });
        sendSerialMessage(arr2ab(line));

    }
);



connectDeviceBtn.addEventListener('click', function () {
    address = document.getElementById('conn-selector-sel').value;
    if (!connections[address]) {
        chrome.serial.connect(address, {bitrate: 38400}, function (conn) {

            if (conn) {
                connections[address] = conn;
                UI.writeToMessage("Connected " + address);
                connectedDevices.push(devices[address]);
                UI.updateConnectedDevices(connectedDevices);
            } else {
                UI.writeToMessage("<err> Could not connect to " + address + "</err>");
            }
        });
    } else {
        UI.writeToMessage("<warn>Warning: " + address + " already connected</warn>");
    }
});


function arr2ab(arr) {
    var buf = new ArrayBuffer(arr.length),
        bufView = new Uint8Array(buf);
    arr.forEach(function (elem, i) {
        bufView[i] = elem;
    });
    return buf;
}



function sendSerialMessage(msg, addr) {
    var connection;
    UI.writeToMessage('Sending message' + msg);
    if (!addr) {
        Object.keys(connections).forEach(function (key) {
            connection = connections[key];
            chrome.serial.send(connection.connectionId, msg, function (evt) {
                UI.writeToMessage('Message sent to ' + key);
            });
        });
    } else {
        connection = connection[addr];
        chrome.serial.send(connection.connectionId, msg, function (evt) {
            UI.writeToMessage('Message sent to ' + addr);
        });
    }

}



sendSignalBtn.addEventListener('click', function () {
    UI.writeToMessage('Sending message ' + signal);
    signal = (signal === testLine) ? allOff : testLine;

    sendSerialMessage(arr2ab(signal));
});

function onGetDevices(ports) {
    devices = {};

    //Mustache.parse(connectionSelectorTmpl);
    UI.writeToMessage("Found devices ");
    UI.updateFoundDevices(ports);

    ports.forEach(function (port) {
        UI.writeToMessage(port.path);
        devices[port.path] = port;
    });

}

document.addEventListener('DOMContentLoaded', function () {
    chrome.serial.getDevices(onGetDevices);
});
