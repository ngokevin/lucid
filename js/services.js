angular.module('LucidApp', [])


.service('EntryService', function() {
    // var entries = [];
    var entries = [
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
    ];
    return {
        get: function() {
            return entries;
        },
        add: function(entry) {
            entries.push(entry);
            return entries;
        },
        del: function(i) {
            entries.splice(i, 1);
            return entries;
        }
    };
});
