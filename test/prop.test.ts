import * as Vue from 'vue'
import { expect } from 'chai'

import * as Utils from './_testutils'

import { Prop } from '../src/prop'
import { VueComponent } from '../src/vuecomponent'

describe('Prop', function(){

    before(function(){
        Vue.config.silent = true;
    })

    after(function(){
        Vue.config.silent = false;
    })

    @VueComponent({
        el: 'eyy',
        template: '<p>hello</p>'
    })
    class PropTest {
        @Prop
        simple_prop:string;

        @Prop({
            default: 'default',
            type: String,
            required: true
        })
        option_prop:string
    }

    it('should have a simple prop', function(){
        var component = Utils.component('prop-test');
        expect(component.$options.props).to.have.property('simple_prop').to.equal(null);
    })
    
    it('should have an option prop', function(){
        var component = Utils.component('prop-test');
        expect(component.$options.props).to.have.property('option_prop').to.have.property('default').to.equal('default');
    })

})