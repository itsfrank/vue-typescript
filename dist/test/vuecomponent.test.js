"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var Vue = require('vue');
var chai_1 = require('chai');
var vuecomponent_1 = require('../src/vuecomponent');
Vue.config.silent = true;
describe('VueComponent', function () {
    var NoParams = (function (_super) {
        __extends(NoParams, _super);
        function NoParams() {
            _super.apply(this, arguments);
        }
        NoParams = __decorate([
            vuecomponent_1.VueComponent, 
            __metadata('design:paramtypes', [])
        ], NoParams);
        return NoParams;
    }(Vue));
    var NameOnly = (function (_super) {
        __extends(NameOnly, _super);
        function NameOnly() {
            _super.apply(this, arguments);
        }
        NameOnly = __decorate([
            vuecomponent_1.VueComponent('nameonly'), 
            __metadata('design:paramtypes', [])
        ], NameOnly);
        return NameOnly;
    }(Vue));
    var OptionsOnly = (function (_super) {
        __extends(OptionsOnly, _super);
        function OptionsOnly() {
            _super.apply(this, arguments);
        }
        OptionsOnly = __decorate([
            vuecomponent_1.VueComponent({}), 
            __metadata('design:paramtypes', [])
        ], OptionsOnly);
        return OptionsOnly;
    }(Vue));
    var NameAndOptions = (function (_super) {
        __extends(NameAndOptions, _super);
        function NameAndOptions() {
            _super.apply(this, arguments);
        }
        NameAndOptions = __decorate([
            vuecomponent_1.VueComponent('nameandoptions', {}), 
            __metadata('design:paramtypes', [])
        ], NameAndOptions);
        return NameAndOptions;
    }(Vue));
    var DataAndFunctions = (function () {
        function DataAndFunctions() {
            this.var_in_class = 30;
        }
        DataAndFunctions.prototype.func_in_class = function () {
            this.var_in_class = 40;
            this.var_in_options = 40;
        };
        DataAndFunctions.prototype.ready = function () {
            return 10;
        };
        DataAndFunctions = __decorate([
            vuecomponent_1.VueComponent({
                data: function () {
                    return {
                        var_in_options: 10
                    };
                },
                methods: {
                    func_in_options: function () {
                        this.var_in_options = 20;
                        this.var_in_class = 20;
                    }
                }
            }), 
            __metadata('design:paramtypes', [])
        ], DataAndFunctions);
        return DataAndFunctions;
    }());
    describe('Decorator Calls', function () {
        it('should be called its snakecase classname on plain decorator', function () {
            var component = getComponent('no-params');
            chai_1.expect(component).not.to.be.undefined;
            chai_1.expect(component.$options.name).to.equal('no-params');
        });
        it('should have its given name on name only decorator', function () {
            var component = getComponent('nameonly');
            chai_1.expect(component).not.to.be.undefined;
            chai_1.expect(component.$options.name).to.equal('nameonly');
        });
        it('should be called its snakecase classname on options only decorator', function () {
            var component = getComponent('options-only');
            chai_1.expect(component).not.to.be.undefined;
            chai_1.expect(component.$options.name).to.equal('options-only');
        });
        it('should be called its given name on both decorator', function () {
            var component = getComponent('nameandoptions');
            chai_1.expect(component).not.to.be.undefined;
            chai_1.expect(component.$options.name).to.equal('nameandoptions');
        });
        it('should throw an error on wrong first param type', function () {
            chai_1.expect(function () { vuecomponent_1.VueComponent(10); }).to.throw(Error);
        });
    });
    describe('Data and Function Bindings', function () {
        it('should be bind class variables and object data', function () {
            var component = getComponent('data-and-functions');
            chai_1.expect(component).to.have.property('var_in_options').that.equals(10);
            chai_1.expect(component).to.have.property('var_in_class').that.equals(30);
        });
        it('should be bind class functions and object methods', function () {
            var component = getComponent('data-and-functions');
            chai_1.expect(component).to.have.property('func_in_options');
            component.func_in_options();
            chai_1.expect(component).to.have.property('var_in_options').that.equals(20);
            chai_1.expect(component).to.have.property('var_in_class').that.equals(20);
            chai_1.expect(component).to.have.property('func_in_class');
            component.func_in_class();
            chai_1.expect(component).to.have.property('var_in_options').that.equals(40);
            chai_1.expect(component).to.have.property('var_in_class').that.equals(40);
        });
        it('should bind hooks to vue instance', function () {
            var component = getComponent('data-and-functions');
            chai_1.expect(component.$options).to.have.property('ready');
            chai_1.expect(component.$options.ready[0]()).to.equal(10);
        });
    });
    describe("Class Constructor", function () {
        it('should return a vue object', function () {
            var obj = new DataAndFunctions();
            chai_1.expect(obj).to.have.property('options').that.has.property('name').that.equals('data-and-functions');
        });
    });
});
function getComponent(name) {
    var constructor = Vue.component(name);
    return new constructor();
}
//# sourceMappingURL=vuecomponent.test.js.map