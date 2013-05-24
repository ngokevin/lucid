angular.module('LucidApp', [])


.service('EntryService', function() {
    /*var entries = [
        {sleep: new Date('May 15, 2013 00:00:00'),
         wake: new Date('May 15, 2013 03:00:00')},
        {sleep: new Date('May 16, 2013 01:00:00'),
         wake: new Date('May 16, 2013 03:00:00')},
        {sleep: new Date('May 17, 2013 02:00:00'),
         wake: new Date('May 17, 2013 03:00:00')},
        {sleep: new Date('May 18, 2013 06:00:00'),
         wake: new Date('May 18, 2013 09:00:00')},
        {sleep: new Date('May 19, 2013 09:00:00'),
         wake: new Date('May 19, 2013 12:00:00')},
        {sleep: new Date('May 20, 2013 21:00:00'),
         wake: new Date('May 20, 2013 24:00:00')},
        {sleep: new Date('May 21, 2013 23:00:00'),
         wake: new Date('May 21, 2013 24:00:00')}
    ];*/
    var entries = [];
    if (localStorage.getItem('entries')) {
        entries = parse(localStorage.getItem('entries'));
    } else {
        localStorage.setItem('entries', stringify(entries));
    }

    return {
        get: function() {
            return entries;
        },
        add: function(entry) {
            entries.push(entry);
            localStorage.setItem('entries', stringify(entries));
            return entries;
        },
        del: function(i) {
            entries.splice(i, 1);
            localStorage.setItem('entries', stringify(entries));
            return entries;
        }
    };

    function parse(entries) {
        entries = $.extend(true, [], JSON.parse(entries));
        for (var i = 0; i < entries.length; i++) {
            entries[i].sleep = new Date(entries[i].sleep);
            entries[i].wake = new Date(entries[i].wake);
        }
        return entries;
    }

    function stringify(entries) {
        entries = $.extend(true, [], entries);
        for (var i = 0; i < entries.length; i++) {
            entries[i].sleep = Date.parse(entries[i].sleep);
            entries[i].wake = Date.parse(entries[i].wake);
        }
        return JSON.stringify(entries);
    }
});
