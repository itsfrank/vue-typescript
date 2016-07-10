import * as Vue from 'vue'
import { DeveloperUtils } from '../src/utils'
import { expect } from 'chai'

Vue.config.silent = true;

export function component(name:string){
    var constructor = Vue.component(name);
    return new constructor();
}

describe('Utils', function(){

    it('should throw an error', function(done){
        var log = console.log;
        console.log = function(){};
        try {
            DeveloperUtils.reportResult();
        } catch(e){
            console.log = log;
            done();
        }
        console.log = log;
    })

    it('should have toggle == to 0', function(){
        DeveloperUtils.start();
        DeveloperUtils.decoratorStart()
        DeveloperUtils.decoratorStop()
        expect(DeveloperUtils['toggler']).to.equal(0);
    })

    it('should not throw an error', function(){
        var log = console.log;
        console.log = function(){};
        DeveloperUtils.reportResult();
        console.log = log;
    })
    
})