"use strict";
var Vue = require('vue');
var config_1 = require('./config');
var utils_1 = require('./utils');
function VueComponent(first, options) {
    utils_1.DeveloperUtils.decoratorStart();
    var type = typeof first;
    if (type == 'function') {
        createDecorator(null, null)(first);
    }
    else if (type == 'string') {
        utils_1.DeveloperUtils.decoratorStop();
        return createDecorator(first, options);
    }
    else if (type == 'object') {
        utils_1.DeveloperUtils.decoratorStop();
        return createDecorator(null, first);
    }
    else {
        throw Error("First parameter of VueComponent must be a string or an object");
    }
    utils_1.DeveloperUtils.decoratorStop();
}
exports.VueComponent = VueComponent;
function camelToSnake(str) {
    var snake = str.replace(/([A-Z])/g, function ($1) { return "-" + $1.toLowerCase(); });
    if (snake.charAt(0) == '-')
        snake = snake.substring(1);
    return snake;
}
;
function createDecorator(name, options) {
    return function decorator(target) {
        var className = camelToSnake(target.toString().match(/\w+/g)[1]);
        // save a reference to the original constructor
        var original = target;
        // a utility function to generate instances of a class
        function construct(constructor, args) {
            var c = function () {
                return constructor.apply(this, args);
            };
            c.prototype = constructor.prototype;
            return new c();
        }
        if (!name)
            name = camelToSnake(target.toString().match(/\w+/g)[1]);
        if (!options)
            options = {};
        if (!options.props)
            options.props = {};
        if (!options.watch)
            options.watch = {};
        if (!options.computed)
            options.computed = {};
        if (options.data) {
            if (typeof options.data == 'function') {
                var data_rtn = options.data();
                options.data = data_rtn;
            }
        }
        else
            options.data = {};
        if (!options.methods)
            options.methods = {};
        if (options['style'])
            delete options['style'];
        var newi = construct(original, {});
        for (var key in newi) {
            if (key.charAt(0) != '$' && key.charAt(0) != '_') {
                var prop_desc = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(newi), key);
                if (prop_desc && prop_desc.get) {
                    var computed_obj = {};
                    if (prop_desc.set) {
                        computed_obj.get = prop_desc.get;
                        computed_obj.set = prop_desc.set;
                    }
                    else {
                        computed_obj = prop_desc.get;
                    }
                    options.computed[key] = computed_obj;
                }
                else if (typeof (newi[key]) == 'function') {
                    if (config_1.default.vueInstanceFunctions.indexOf(key) > -1) {
                        options[key] = newi[key];
                    }
                    else {
                        if (key != 'constructor')
                            options.methods[key] = newi[key];
                    }
                }
                else {
                    options.data[key] = newi[key];
                }
            }
            else if (key == "$$props") {
                for (var prop in newi.$$props) {
                    options.props[prop] = newi.$$props[prop];
                }
            }
            else if (key == "$$watch") {
                for (var watch in newi.$$watch) {
                    options.watch[watch] = newi.$$watch[watch];
                }
            }
        }
        for (key in options.props) {
            if (options.data[key]) {
                if (!options.props[key])
                    options.props[key] = {};
                options.props[key].default = options.data[key];
                delete options.data[key];
            }
        }
        for (var i in newi.$$methodsToRemove) {
            delete options.methods[newi.$$methodsToRemove[i]];
        }
        var data = options.data;
        options.data = function () { return data; };
        Vue.component(name, options);
        // the new constructor behaviour
        // var f:()=>void = function () {
        //     return Vue.component(name);
        // }
        // return f;
        return Vue.component(name);
    };
}
//# sourceMappingURL=vuecomponent.js.map