import * as Vue from 'vue'
import { expect } from 'chai'

import * as Utils from './_testutils'

import { Prop } from '../src/prop'
import { VueComponent } from '../src/vuecomponent'

describe('Prop', function(){

    @VueComponent(<any>{
        template: '<p>hello</p>'
    })
    class PropTest extends Vue{
        @Prop
        simple_prop:string = 'default val';
       
        @Prop
        object_prop:any = {im: 'an object'};
        
        @Prop({
            default: 'default',
            type: String,
            required: true
        })
        option_prop:string
    }

    it('should have a simple prop', function(){
        var component = new PropTest();
        expect(component.$options['props']).to.have.property('simple_prop').that.has.property('default').that.equals('default val');
})
    
    it('should have an option prop', function(){
        var component = Utils.component('prop-test');
        expect(component.$options.props).to.have.property('option_prop').to.have.property('default').to.equal('default');
        expect(component.$options.data()).to.not.haveOwnProperty('option_prop');
    })
    
    it('should clone objects', function(){
        var component = Utils.component('prop-test');
        var o1 = component.$options.props.object_prop.default;
        component = Utils.component('prop-test');
        var o2 = component.$options.props.object_prop.default;
        expect(o1()).to.not.equal(o2());
    })

})