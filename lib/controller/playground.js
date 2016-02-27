/*
 * Playground view controller
 *
 * Controller for playground view
 */

var app = require('../app'),
    triggers = require('../service/triggers');

app.controller('PlaygroundController', function ($scope) {
    // Set export dialogs
    $scope.exportDialogs = [ 'save', 'share' ];

    // Store playground code before closing
    window.onbeforeunload = storePlaygroundCode;

    // Load code from localStorage
    $scope.playground = {
        code : localStorage.playgroundCode || ''
    };
    $scope.triggers = triggers.getTriggers();
    var c = triggers.extractFromCode($scope.playground.code);
    $scope.playground.code = c.code;
    $scope.selectedTrigger = c.trigger;

    if(!$scope.selectedTrigger) {
        $scope.selectedTrigger = $scope.triggers[0];
    }

    /*
     * Save current playground code in localStorage (Or remove if empty)
     *
     * @return void
     */
    function storePlaygroundCode() {
        if (!$scope.playground.code || !$scope.playground) {
            localStorage.removeItem('playgroundCode');
        } else {
            localStorage.playgroundCode = '#trigger:' + $scope.selectedTrigger.id + '\n' + $scope.playground.code;
        }
    }
});
