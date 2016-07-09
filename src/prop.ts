

export function Prop(options: vuejs.PropOption) //With options
export function Prop(target:Object, key:string)
export function Prop(first:any, second?:string) {
    if (!second){
        return function(target: any, key: string) {
            (target.$$props || (target.$$props = {}))[key] = first;
        };
    } else {
        (first.$$props || (first.$$props = {}))[second] = null;
    }
}