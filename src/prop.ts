import { DeveloperUtils } from './utils'

export function Prop(options: vuejs.PropOption) //With options
export function Prop(target:Object, key:string)
export function Prop(first:any, second?:string) {
    //Bare decorator (no params)
    if (second) propDecorator(null)(first, second);
    //Decorator with params
    else return propDecorator(first);
}

function propDecorator(options?:any) {
    return function(target:any, key:string) {
        DeveloperUtils.decoratorStart();
        //create the temp props holder if non existane
        if (!target.$$props) target.$$props = {};
        
        if(!options) options = null;

        target.$$props[key] = options;
        //remove it from the instance so it is not added to data
        delete target[key];

        DeveloperUtils.decoratorStop();
    }
}