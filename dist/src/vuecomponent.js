"use strict";
var Vue = require('vue');
var config_1 = require('./config');
function VueComponent(first, options) {
    var type = typeof first;
    if (type == 'function') {
        createDecorator(null, null)(first);
    }
    else if (type == 'string') {
        return createDecorator(first, options);
    }
    else if (type == 'object') {
        return createDecorator(null, first);
    }
    else {
        throw Error("First parameter of VueComponent must be a string or an object");
    }
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
        var newi = construct(original, {});
        for (var key in newi) {
            if (key.charAt(0) != '$' && key.charAt(0) != '_') {
                if (typeof (newi[key]) == 'function') {
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
        }
        var data = options.data;
        options.data = function () { return data; };
        RegisteredComponents.registerComponent(name, Vue.component(name, options));
        // the new constructor behaviour
        var f = function () {
            return RegisteredComponents.getComponent(name);
        };
        return f;
    };
}
var RegisteredComponents = (function () {
    function RegisteredComponents() {
    }
    RegisteredComponents.registerComponent = function (name, constructor) {
        this.constructors[name] = constructor;
    };
    RegisteredComponents.getComponent = function (name) {
        return this.constructors[name];
    };
    RegisteredComponents.constructors = {};
    return RegisteredComponents;
}());
exports.RegisteredComponents = RegisteredComponents;
;
//# sourceMappingURL=vuecomponent.js.map