const VueData = require('./vuedata.json');

export class RegisteredComponents {
    private static constructors = {};
    public static registerComponent(name:string, constructor:any){
        this.constructors[name] = constructor;
    }
    public static getComponent(name:string){
        return this.constructors[name];
    }
};

// var className: string = this.constructor.toString().match(/\w+/g)[1];
export function VueComponent(element:string, options:vuejs.ComponentOption){
    return function decorator(target:any){
        // save a reference to the original constructor
        var original = target;
        // a utility function to generate instances of a class
        function construct(constructor, args) {
            var c : any = function () {
            return constructor.apply(this, args);
            }
            c.prototype = constructor.prototype;
            return new c();
        }

            if(!options.props) options.props = {}
            if(!options.data) options.data = {}
            if(!options.methods) options.methods = {}

            var style_path = undefined;
            if(options['style']) {
                delete options['style'];
            }
            var newi = construct(original, {});
            
            for(var key in newi){
                if(key.charAt(0) != '$' && key.charAt(0) != '_'){
                    if(typeof(newi[key]) == 'function'){
                        if(VueData.vueInstanceFunctions.indexOf(key) > -1){
                            options[key] = newi[key]
                        } else {
                            options.methods[key] = newi[key];
                        }
                     } else {
                        options.data[key] = newi[key];
                    }
                } else if (key == "$$props"){
                    for(var prop in newi.$$props){
                        options.props[prop] = newi.$$props[prop]
                    }
                }
            }
            var data = options.data;
            options.data = function() {return data}
            RegisteredComponents.registerComponent(element, Vue.component(element, options));

        // the new constructor behaviour
        var f : any = function (...args) {
            return RegisteredComponents.getComponent(element);
        }
        return f;
    }
}

export function Prop(target:any, key:any): any; //Default
export function Prop(options: vuejs.PropOption): any; //With options
export function Prop(...params:any[]): any {
    if (params.length == 1){
        return function(target: any, key: string) {
            (target.$$props || (target.$$props = {}))[key] = params[0];
        };
    } else if (params.length == 3) {
        (params[0].$$props || (params[0].$$props = {}))[params[1]] = null;
    }
}