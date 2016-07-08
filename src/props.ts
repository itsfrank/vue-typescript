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