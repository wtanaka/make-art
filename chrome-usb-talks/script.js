/*jshint browser: true*/
/*global chrome*/

"use strict";

var writeToMessage = function (msg)  {
    var doc = document.getElementById("console").innerHTML;
        document.getElementById("console").innerHTML = doc + "<br/>&gt; " + msg;
    },
    devices = {},
    connectDeviceBtn = document.getElementById("connect-device");


chrome.runtime.onMessageExternal.addListener(
    function (request, sender, sendResponse) {
        document.getElementById("message").innerHTML = "REceived message";
        console.log("Message received");
        console.log(request);
        console.log(sender);
        sendResponse({result: "OK"});
    }
);

connectDeviceBtn.addEventListener('click', function () {
    var device;
    chrome.usb.getUserSelectedDevices({'multiple': false}, function (found_devices) {
        if (chrome.runtime.lastError !== undefined) {
            console.warn('chrome.usb.getDevices error: ' + chrome.runtime.lastError.message);
            return;
        }

        for (device of found_devices) {
            devices[device.device] = device;
            console.log(device);
            writeToMessage("Connected to " + device.manufacturerName);
        }
    });

});
