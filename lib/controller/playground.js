/*
 * Playground view controller
 *
 * Controller for playground view
 */

var app = require('../app');

app.controller('PlaygroundController', function ($scope) {
    // Set export dialogs
    $scope.exportDialogs = [ 'save', 'share' ];

    // Store playground code before closing
    window.onbeforeunload = storePlaygroundCode;

    // Load code from localStorage
    $scope.playground = {
        code : localStorage.playgroundCode || ''
    };
    $scope.triggers = [{
        id: 1,
        name: 'When location changes',
        code: 'createToolbar(function(val) { window.redraw(true, val); });',
        valueName: 'location'
    },{
        id: 2,
        name: 'Every 5 seconds',
        code: 'clearInterval(window.interval);window.interval = window.setInterval(function() { window.redraw(true); }, 5000);'
    }];
    $scope.selectedTrigger = $scope.triggers[0];
    var line = $scope.playground.code.split('\n').shift(),
        m = line.match(/#trigger:(\d+).*/);
    if (m && m[1]) {
        for (var i = 0; i < $scope.triggers.length; i++) {
            if ($scope.triggers[i].id === parseInt(m[1])) {
                $scope.selectedTrigger = $scope.triggers[i];
                break;
            }
        }
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
