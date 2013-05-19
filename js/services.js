angular.module('LucidApp', [])


.service('EntryService', function() {
    var entries = [];
    return {
        get: function() {
            return entries;
        },
        add: function(entry) {
            entries.push(entry);
        },
        del: function(i) {
            return entries.splice(i, 1);
        }
    };
});
