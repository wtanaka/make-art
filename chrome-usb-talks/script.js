/*jshint browser: true*/
/*global chrome*/

"use strict";

var testLine = [0x55, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07];
var allOff = [0x55, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00];
var colMap = {
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
    line;


function calculateLightString () {
}

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
        line = allOff.slice(0);

        request.commands.forEach(function (c) {
            var index;
            writeToMessage("<b>Command</b> " + c.command + '(' + c.column + ', ' + c.row + ')' );
            if (c.command === 'lightOn') {
                index = colMap[c.column] + (c.row - 1) * 9;
                line[index] = 0x07;
            }
        });
        sendSerialMessage(arr2ab(line));

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
    address = "/dev/cu.usbserial-00001014";
    chrome.serial.getDevices(onGetDevices);
    chrome.serial.connect(address, {bitrate: 38400}, function (conn) {
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

function arr2ab(arr) {
    var buf = new ArrayBuffer(arr.length),
        bufView = new Uint8Array(buf);
    arr.forEach(function (elem, i) {
        bufView[i] = elem;
    });
    return buf;
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
    chrome.serial.send(connections[0].connectionId, msg, function (evt) {
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
    signal = (signal === testLine) ? allOff : testLine;

    sendSerialMessage(arr2ab(signal));


});
