"use strict";
var utils_1 = require('./utils');
function Watch(name, options) {
    return function (target, key) {
        utils_1.DeveloperUtils.decoratorStart();
        if (!target.$$watch)
            target.$$watch = {};
        var watched = target[key] ? name : key;
        var handler = target[key] ? target[key] : name;
        //if watch is called on a function, make sure the function does not end up in methods
        if (typeof handler != 'string') {
            if (!target.$$methodsToRemove)
                target.$$methodsToRemove = [];
            target.$$methodsToRemove.push(key);
        }
        if (options)
            options.handler = handler;
        else
            options = handler;
        target.$$watch[watched] = options;
        utils_1.DeveloperUtils.decoratorStop();
    };
}
exports.Watch = Watch;
//# sourceMappingURL=watch.js.map