import * as Vue from 'vue'
import { expect } from 'chai'

import * as Utils from './_testutils'

import { VueComponent } from '../src/vuecomponent'


describe('VueComponent', function(){
    
    @VueComponent
    class NoParams extends Vue {
    }
    
    @VueComponent('nameonly')
    class NameOnly extends Vue {
    }
    
    @VueComponent({
        style: 'hello'
    })
    class OptionsOnly extends Vue {
    }
    
    @VueComponent('nameandoptions', {})
    class NameAndOptions extends Vue {
    }

    @VueComponent({
        data: function(){
            return {
                var_in_options: 10 
            }
        },
        methods: {
            func_in_options() {
                this.var_in_options = 20;
                this.var_in_class = 20;
            }
        }
    })
    class DataAndFunctions {
        var_in_class:number = 30;
        func_in_class() {
            this.var_in_class = 40;
            (<any>this).var_in_options = 40;
        }

        ready(){
            return 10;
        }
    }

    describe('Decorator Calls', function(){
        
        it('should be called its snakecase classname on plain decorator', function(){
            var component = Utils.component('no-params');
            expect(component).not.to.be.undefined;
            expect(component.$options.name).to.equal('no-params');
        });

        it('should have its given name on name only decorator', function(){
            var component = Utils.component('nameonly');
            expect(component).not.to.be.undefined;
            expect(component.$options.name).to.equal('nameonly');
        });

        it('should be called its snakecase classname on options only decorator', function(){
            var component = Utils.component('options-only');
            expect(component).not.to.be.undefined;
            expect(component.$options.name).to.equal('options-only');
        });

        it('should be called its given name on both decorator', function(){
            var component = Utils.component('nameandoptions');
            expect(component).not.to.be.undefined;
            expect(component.$options.name).to.equal('nameandoptions');
        });

        it('should throw an error on wrong first param type', function(){
            expect(function(){(<any>VueComponent)(10)}).to.throw(Error);
        });
    
    });

    describe('Data and Function Bindings', function(){

        it('should be bind class variables and object data', function(){
            var component = Utils.component('data-and-functions');
            expect(component).to.have.property('var_in_options').that.equals(10);
            expect(component).to.have.property('var_in_class').that.equals(30);
        });

        it('should be bind class functions and object methods', function(){
            var component = Utils.component('data-and-functions');
            expect(component).to.have.property('func_in_options');
            component.func_in_options();
            expect(component).to.have.property('var_in_options').that.equals(20);
            expect(component).to.have.property('var_in_class').that.equals(20);
            expect(component).to.have.property('func_in_class');
            component.func_in_class();
            expect(component).to.have.property('var_in_options').that.equals(40);
            expect(component).to.have.property('var_in_class').that.equals(40);
        });

        it('should bind hooks to vue instance', function(){
            var component = Utils.component('data-and-functions');
            expect(component.$options).to.have.property('ready');
            expect(component.$options.ready[0]()).to.equal(10);     
        })

    });

    describe("Class Constructor", function (){

       it('should return a vue object', function(){
           var obj:any = new DataAndFunctions();
           expect(obj).to.have.property('options').that.has.property('name').that.equals('data-and-functions');
       });

    });


});