import { DeveloperUtils } from './utils'

export function Watch(name:string)
export function Watch(name:string, options:WatchOption)
export function Watch(name:string, options?:WatchOption) {
    return function(target:any, key:string) {
        DeveloperUtils.decoratorStart();

        if (!target.$$watch) target.$$watch = {};

        var watched = target[key] ? name : key;
        var handler = target[key] ? target[key] : name;

        //if watch is called on a function, make sure the function does not end up in methods
        if (typeof handler != 'string') {
            if (!target.$$methodsToRemove) target.$$methodsToRemove = [];
            target.$$methodsToRemove.push(key);
        }

        if (options) options.handler = handler;
        else options = handler;

        target.$$watch[watched] = options;

        DeveloperUtils.decoratorStop();
    }
}

export declare interface WatchOption {
    handler?: (val: any, oldVal: any)=>void;
    deep?: boolean;
    immidiate?: boolean;
}
