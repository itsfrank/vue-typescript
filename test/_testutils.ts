import * as Vue from 'vue'

export function component(name:string){
    var constructor = Vue.component(name);
    return new constructor();
}