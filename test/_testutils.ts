import * as Vue from 'vue'

Vue.config.silent = true;

export function component(name:string){
    var constructor = Vue.component(name);
    return new constructor();
}