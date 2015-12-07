/*
 * Playground view controller
 *
 * Controller for playground view
 */

var app = require('../app');

app.controller('PlaygroundController', function ($scope, $interval, $http) {
    // Set export dialogs
    $scope.exportDialogs = [ 'save', 'share' ];

    $scope.blade_available = false;
    $scope.blade_popup_open = true;

    // Store playground code before closing
    window.onbeforeunload = storePlaygroundCode;

    // Load code from localStorage
    $scope.playground = {
        code : localStorage.playgroundCode || ''
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

    $scope.closePopup = function () {
        $scope.blade_popup_open = false;
    };

});
