import * as Vue from 'vue'
import { expect } from 'chai'

import * as Utils from './_testutils'

import { Watch } from '../src/watch'
import { VueComponent } from '../src/vuecomponent'

describe('Watch', function(){

    @VueComponent
    class WatchTest{
        watchedOne:string = 'watch one';

        @Watch('onWatchedTwoChange', {deep: true})
        watchedTwo:string = 'watch two';

        done:()=>void = function(){};

        @Watch('watchedOne')
        onWatchedOneChange() {
            this.oneChanged();
        }

        onWatchedTwoChange(){
            this.twoChanged();
        }

        oneChanged(){
            this.done()
        }
        
        twoChanged(){
            this.done()
        }

    }

    var component = Utils.component('watch-test');

    it('should have property in data', function(){
        expect(component).to.have.property('watchedOne').that.equals('watch one');
    });

    it('should have options when provided', function(){
        expect(component.$options.watch.watchedTwo).to.have.property('deep').that.equals(true);
    })

    it('should react to change when decorator on function', function(done){
        component.done = done;
        component.watchedOne = 'test';
    })

    it('should react to change when decorator on variable', function(done){
        component.done = done;
        component.watchedTwo = 'test';
    })

})
