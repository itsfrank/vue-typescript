"use strict";
var utils_1 = require('./utils');
function Prop(first, second) {
    //Bare decorator (no params)
    if (second)
        propDecorator(null)(first, second);
    else
        return propDecorator(first);
}
exports.Prop = Prop;
function propDecorator(options) {
    return function (target, key) {
        utils_1.DeveloperUtils.decoratorStart();
        //create the temp props holder if non existane
        if (!target.$$props)
            target.$$props = {};
        if (!options)
            options = null;
        target.$$props[key] = options;
        //remove it from the instance so it is not added to data
        delete target[key];
        utils_1.DeveloperUtils.decoratorStop();
    };
}
//# sourceMappingURL=prop.js.map