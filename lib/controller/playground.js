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
    $scope.triggers = trigger.getTriggers();
    $scope.selectedTrigger = $scope.triggers[0];
    var line = $scope.playground.code.split('\n').shift(),
        m = line.match(/#trigger:(\d+).*/);
    if (m && m[1]) {
        $scope.selectedTrigger = triggers.getTrigger(parseInt(m[1]));
        var s = $scope.playground.code.split('\n');
        s.shift();
        $scope.playground.code = s.join('\n');
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
