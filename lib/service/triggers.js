var triggers = [{
    id: 'none',
    name: '',
    code: ''
},{
    id: 1,
    name: 'When location changes',
    code: 'createToolbar(function(val) { window.redraw(true, val); });',
    valueName: 'location'
},{
    id: 2,
    name: 'Every 5 seconds',
    code: 'clearInterval(window.interval);window.interval = window.setInterval(function() { window.redraw(true); }, 5000);'
}];

module.exports = {
    getTriggers () {
        return triggers;
    },
    getTrigger (id) {
        for (var i = 0; i < triggers.length; i++) {
            if (triggers[i].id === id) {
                return triggers[i];
            }
        }
    }
};
