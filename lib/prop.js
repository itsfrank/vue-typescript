"use strict";
function Prop() {
    var params = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        params[_i - 0] = arguments[_i];
    }
    if (params.length == 1) {
        return function (target, key) {
            (target.$$props || (target.$$props = {}))[key] = params[0];
        };
    }
    else if (params.length == 3) {
        (params[0].$$props || (params[0].$$props = {}))[params[1]] = null;
    }
}
exports.Prop = Prop;
//# sourceMappingURL=prop.js.map