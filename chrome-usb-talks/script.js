/*jshint browser: true*/
/*global chrome*/

"use strict";

var writeToMessage = function (msg)  {
        var container = document.getElementById("console"),
            doc = container.innerHTML;
        container.innerHTML = doc + "<br/>&gt; " + msg;
        container.scrollTop = 5000;

    },
    devices = {},
    connectDeviceBtn = document.getElementById("connect-device"),
    sendSignalBtn = document.getElementById("send-signal"),
    signal = 'n',
    connections = [];

chrome.runtime.onMessageExternal.addListener(
    function (request, sender, sendResponse) {

        request.commands.forEach(function (c) {
            writeToMessage("<b>Command</b> " + c.command + '(' + c.column + ', ' + c.row + ')' );
            if (c.command === 'lightOn') {
                sendSerialMessage('y');
            }
            sendResponse({result: "OK"});
        });

    }
);

connectDeviceBtn.addEventListener('click', function () {
    var device,
        onGetDevices = function (ports) {
            var i;
            for (i = 0; i < ports.length; i++) {
                writeToMessage(ports[i].path);
            }
        },
    address = "/dev/cu.usbmodem1411";
    chrome.serial.getDevices(onGetDevices);
    chrome.serial.connect(address, {bitrate: 9600}, function (conn) {
        console.dir(conn);
        connections.push(conn);
        writeToMessage("Connected");
    });
    // USB *****************************
    //
    // chrome.usb.getUserSelectedDevices({'multiple': false}, function (found_devices) {
    //     if (chrome.runtime.lastError !== undefined) {
    //         console.warn('chrome.usb.getDevices error: ' + chrome.runtime.lastError.message);
    //         return;
    //     }

    //     for (device of found_devices) {
    //         devices[device.device] = device;
    //         console.log(device);
    //         writeToMessage("Connected to " + device.manufacturerName);
    //     }
    // });

});

function ab2str(buf) {
  return String.fromCharCode.apply(null, new Uint16Array(buf));
}

function str2ab(str) {
    var buf = new ArrayBuffer(str.length * 2), // 2 bytes for each char
        bufView = new Uint16Array(buf),
        strLen,
        i;
    for (i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return buf;
}

function sendSerialMessage(msg) {
    writeToMessage('Sending message' + msg);
    chrome.serial.send(connections[0].connectionId, str2ab(msg), function (evt) {
        writeToMessage('The led should have changed state');
        console.dir(evt);
    });
}

sendSignalBtn.addEventListener('click', function () {
    writeToMessage('Sending message ' + signal);

    //Object.keys(devices).forEach(function (key) {
        //  var device = devices[key];


        // chrome.usb.openDevice(device, function (conn) {
        //     var transferInfo = {
        //         "direction": "in",
        //         "endpoint": 1,
        //         "length": 1,
        //         data: str2ab(signal)
        //     };
        //     chrome.usb.bulkTransfer(conn, transferInfo, function (event) {
        //         writeToMessage('Received ' + event.resultCode);
        //         writeToMessage('data ' + ab2str(event.data));
        //         console.dir(event);
        //     });
        // });
    //});
    signal = (signal === 'y') ? 'n' : 'y';
    sendSerialMessage(signal);


});
