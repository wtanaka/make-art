/*
 * Playground view controller
 *
 * Controller for playground view
 */
"use strict";
var app = require('../app');

app.controller('PlaygroundController', function ($scope, $interval, $http) {
    // Set export dialogs
    $scope.exportDialogs = ['save', 'share'];

    $scope.blade_available = false;
    $scope.blade_popup_open = true;

    // Store playground code before closing
    window.onbeforeunload = storePlaygroundCode;

    // Load code from localStorage
    $scope.playground = {
        code : localStorage.playgroundCode || '',
        lb_message: ""
    };

    /*
     * Save current playground code in localStorage (Or remove if empty)
     *
     * @return void
     */
    function storePlaygroundCode() {
        if (!$scope.playground.code || !$scope.playground) {
            localStorage.removeItem('playgroundCode');
        } else {
            localStorage.playgroundCode = $scope.playground.code;
        }
    }

    $interval(function () {
        console.log('setInterval');
        $http({
            method: 'GET',
            url: window.LIGHTSERVER + '/discovery'
        }).then(function successCallback(response) {

            $scope.display_name = response.data.display_name;
            $scope.ip = response.data.ip;
            $scope.name = response.data.name;
            $scope.online = response.data.online;
            $scope.producer = response.data.producer;

            $scope.blade_available = true;

        }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            $scope.blade_available = false;
        });
    }, 3000);

    $scope.sendMessage = function () {
        var message = $scope.playground.lb_message,
            data = {
                "text": message,
                "delay": 0.1
            };
        if (message && message.length <= 140) {
            $http.post(window.LIGHTSERVER + '/light/text', data).then(function successCallback(response) {
                if (response.status === 200) {
                    $scope.playground.lb_message = 'Done, look at the lightboard';
                }
            }, function errorCallback(response) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                alert("Error");
            });

        } else if (message) {
        };
    };

    $scope.closePopup = function () {
        $scope.blade_popup_open = false;
    };

});
