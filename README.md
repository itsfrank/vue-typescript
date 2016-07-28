# vue-typescript
Typescript decorators to make vue play nice with typescript

[![circleci](https://img.shields.io/circleci/project/itsFrank/vue-typescript.svg??style=flat-square)](https://circleci.com/gh/itsFrank/vue-typescript)
[![npm](https://img.shields.io/npm/v/vue-typescript.svg)](https://www.npmjs.com/package/vue-typescript)
[![npm](https://img.shields.io/npm/dt/vue-typescript.svg)](https://www.npmjs.com/package/vue-typescript)
[![npm](https://img.shields.io/npm/l/express.svg?maxAge=2592000)](https://opensource.org/licenses/MIT)
[![GitHub stars](https://img.shields.io/github/stars/itsFrank/vue-typescript.svg?style=social&label=Star)](https://github.com/itsFrank/vue-typescript)


## Why do i need this?
I built this mostly to remove the red squiggles on VSCode, but also to make Vue work seamlessly while still writing code that feels like typescript.

While you can just declare all your components as 'any' and carry on, you lose all the fantastic features of typescript. However, i also wanted to make sure i still had access to the entirety of Vue's features; so vue-typescript is built in such a way that you can pick and chose how much of it you want to use and what you would rather stick to standard Vue syntax for.

![screenshot](https://raw.githubusercontent.com/itsFrank/vue-typescript/master/screenshot.png "Logo Title Text 1")
# Install
This package has one single peer-dependancy: Vue (obviously) 

```
npm install --save vue-typescript
```
For the best experience you will want to use typings and `typings install --save --global dt~vue` as some decorators use these typings for input parameters. If you dont want to use them, the typed vue object will be handled as `any`.

Alternatively, clone the [vue-typescript-seed](https://github.com/itsFrank/vue-typescript-seed) repo 


# Features
- **@VueComponent** - A class decorator that registers the class as a vue component
- **@Prop** - A variable decorator that adds a class' variables to the prop object instead of data
- **@Watch** - A variable or function decorator that adds a property to the watch object mapping the desired function as handler
- **Computed Properties** - to define computed properties, simply use the native typescript syntax `get` and `set` (see example below)

# Usage
##### @VueComponent
There are 4 ways to call it:
    
&nbsp;&nbsp;&nbsp;&nbsp;`@VueComponent`  
&nbsp;&nbsp;&nbsp;&nbsp;`@VueComponent(element:string)`  
&nbsp;&nbsp;&nbsp;&nbsp;`@VueComponent(options:ComponentOption)`  
&nbsp;&nbsp;&nbsp;&nbsp;`@VueComponent(element:string, options:ComponentOption)`  
&nbsp;&nbsp;&nbsp;&nbsp; element - string to use as html tag  
&nbsp;&nbsp;&nbsp;&nbsp; options - the same object as the one you would use when calling Vue.component  

By default, the tag will be the snake-case version of the class name, and options will be an empty object { } 

##### @Prop
There are 2 ways to call it:
    
&nbsp;&nbsp;&nbsp;&nbsp;`@Prop`  
&nbsp;&nbsp;&nbsp;&nbsp;`@Prop(options:PropOption)`  

&nbsp;&nbsp;&nbsp;&nbsp; options - the same object as the one you would use defining a prop  

By default, the prop will behave equivalently to having &nbsp;`myProp: null` &nbsp; in the props object. However, if you give a value to a value to a variable decorated by prop (see example below), the default property of the prop object will be set to this value. If the value if of type array or object, don't worry about wrapping it in a function like you would do in standard vue, to provide maximum type checking and intelisense, vue-typescript clones and wraps it into a function for you.

##### @Watch
It can be applied to either a function or a variable, and for each application, there are 2 ways to call it:
    
&nbsp;&nbsp;&nbsp;&nbsp;`@Watch(name:string)`  
&nbsp;&nbsp;&nbsp;&nbsp;`@Watch(name:string, options:WatchOption)`  

&nbsp;&nbsp;&nbsp;&nbsp; name - the name of the variable to watch (if applied to a function). Or the name of the method to call when the variable changes (if applied to a variable)  
&nbsp;&nbsp;&nbsp;&nbsp; options - the same object as the one you would use defining a property on the watch object (note that defining a handler is useless as it will get replaced in any case)  

# Behaviour
- **Variables** - unless the @Prop decorator is used, all variables in a class will be returned by the data object
- **Functions** - all functions that do not match the name of a Vue lifecycle hook, or are defined with the `get` and `set` kewywords, will be put in the methods object. Any function named like one of the hook (ex: 'ready()') will be added as a property of the options object and not to methods (see second example), while functions defined as `get/set myFunc()...` will be used to create the computed object. 
- **Option Object** - the option object allows to access features that may not have been implemented yet by vue-typescript, or simply offers the option to have a hybrid vanilla vue / typescript component. However, is a property is defined in bot the options obect and the class, the class variable will overwrite the one in options. 
- **Constructors** - Avoid defining constructors for classes that will be decorated by @VueComponent. An instance of the object is created at load time to create a vue object and register the component, if the constructor relies on parameters, there will be 'undefined' errors as these parameters will obviously not be passed.  
**see note on behaviour of `new` below

# Examples

### Pure Typescript:
```Typescript
import * as Vue from 'vue'
import { VueComponent, Prop } from 'vue-typescript'

@VueComponent
class MyComponent {
    @Prop someProp:string;

    @Prop({
        type: String
    })
    someDefaultProp:string = 'some default value'; 

    @Prop someObjProp:{some_default:string} = {some_default: 'value'}; //vue-typescript makes sure to deep clone default values for array and object types

    @Prop someFuncProp(){ //defined functions decorated with prop are treated as the default value
        console.log('logged from default function!');
    }

    someVar:string = 'Hello!';
    
    doStuff() {
        console.log('I did stuff');
    }
}

```
Is equivalent in Javascript to:
```Javascript
Vue.component('my-component', {
    props: {
        someProp:null,
        someDefaultProp : {
            type: String,
            default: 'some default value'
        },
        someObjProp: {
            default: function(){
                return {
                    default: 'value'
                }
            }
        },
        someFuncProp: {
            type: Function //if it finds the default is a function, it automatically sets the type
            default: function(){
                console.log('logged from default function!');
            }
        }
    },
    data: function(){
        return {
            someVar: 'Hello!'
        }
    },
    methods: {
        doStuff: function(){
            console.log('I did stuff');
        }
    }
})
```
***
### Hybrid Object With Lifecycle Hooks:
```Typescript
import * as Vue from 'vue'
import { VueComponent, Prop } from 'vue-typescript'

@VueComponent('dope-tag', {
    watch: {
        'lookAtMe': function(old, new) {
            this.itChanged(new); 
        }
    }
})
class MyDopeComponent extends Vue { //extend Vue to get intelisense on vm functions like $broadcast()
    lookAtMe:string;

    ready() {
        this.lookAtMe = 'I\'ve changed';
    }

    itChanged(new:string) {
        this.$broadcast('New var: ' + this.lookAtMe);
    }
}
``` 
Is equivalent in Javascript to:
```Javascript
Vue.component('dope-tag', {
    data: {
        return {
            lookAtMe: undefined
        }
    },
    methods: {
        itChanged: function(new){
            this.$broadcast('New var: ' + this.lookAtMe);
        }
    },
    watch: {
        'lookAtMe': function(old, new) {
            this.itChanged(new); 
        }
    },
    ready: function() {
        this.lookAtMe = 'I\'ve changed';
    }
})
```
***
### @Watch examples
Decorator on function:
```Typescript
@VueComponent
class MyClass {
    watchMe:string = 'look at meee!';

    @Watch('watchMe')
    myFunction(new_val:string, old_val:string){
        console.log('it was: ' + old_val);
        console.log('now it\'s: ' + new_val);
    }
}
```
is equivalent to:
```Javascript
Vue.component('my-class', {
    data: function(){
        return {
            watchMe: 'look at meee!'
        }
    },
    watch: {
        watchMe: function(new_val, old_val){
            console.log('it was: ' + old_val);
            console.log('now it\'s: ' + new_val);
        }
    }
})
```
Decorator on variable with options:
```Typescript
@VueComponent
class MyClas {
    @Watch('myFunction', {deep: true})
    watchMe:string = 'look at meee!';

    myFunction(new_val:string, old_val:string){
        console.log('it was: ' + old_val);
        console.log('now it\'s: ' + new_val);
    }
}
```
is equivalent to:
```Javascript
Vue.component('my-class', {
    data: function(){
        return {
            watchMe: 'look at meee!'
        }
    },
    methods: {
        myFunction: function(new_val, old_val){
            console.log('it was: ' + old_val);
            console.log('now it\'s: ' + new_val);
        }
    }
    watch: {
        watchMe: {
            handler: 'myFunction',
            deep: true
        }
    }
})
```
***
### Computed Properties example
in typescript:
```Typescript
@VueComponent
class ComputedStuff {
    firstname:String = 'Jon';
    lastname:String = 'Snowflake';

    get fullname():string {
        return this.firstname + ' ' + this.lastname;
    }

    set fullname(name:string){
        var name_arr = name.split(' ');
        this.firstname = name_arr[0];
        this.lastname = name_arr[0]; //you would probably want to add checks here to prevent errors
    }

    ready(){
        this.fullname = 'Jon Snowstorm';
    }
}
```
javascript equivalent:
```Javascript
Vue.component('computed-stuff', {
    data: function(){
        return {
            firstname: 'Jon',
            lastname: 'Snowflake'
        }
    },
    computed: {
        fullname: {
            get: function(){
                return this.firstname + ' ' + this.lastname;
            },
            set: function(name:string){
                var name_arr = name.split(' ');
                this.firstname = name_arr[0];
                this.lastname = name_arr[0]; //you would probably want to add checks here to prevent errors
            }
        }
    },
    ready: function(){
        this.fullname = 'Jon Snowstorm';
    }
})
```
***
### Integration With vue-router
vue-typescript works perfectly with vue-router:
```Typescript
import * as Vue from 'vue'
import * as VueRouter from 'vue-router'
import { VueComponent } from 'vue-typescript'

@VueComponent({
    template: '<h1> Welcome Home {{guy}} </h1>' //you can use require('./home_template.html') here if you're using something like webpack
})
class HomeView {
    guy:string = 'Frank';
}

Vue.use(VueRouter);

var app = Vue.extend({});
var router = new VueRouter();

router.map({
  '/' : {
    component: HomeView
  }
});

router.start(app, '#my-app');
```

#### Note on using `new` with component classes
Calling something like `new MyComponent()` will actually not construct a new MyComponent object, It will actually create a new vue component instance, with the properly formated data, methods, props, watch, etc.. objects. The class MyComponent is actually equivalent to the return of `Vue.component('my-component')`.

# Planned Features
- scoped styles (in the decorator options)
- @on / @once - function decorators to register event handlers
- @VueDirective - define custom directives as typescript classes
- @VueFilter - define custom directives as typescript classes
- @VueExtend - classs decorator to create a vue subclass 

# Hacking It
Although its never recomended to make changes inside node_modules, if you find a bug that prevents you from moving forward and need to fix it ASAP. Just cd to the module directory, run `typings install --production` (this will ommit the mocha, chai, and node typings). Then make your fix and run `npm run build`. Your IDE might throw a fit because there's no tsconfig, to fix that rename tsconfig.build.json to tsconfig.json (simply run `tsc` if you do that, the build command points tsc to the .build.json file). Depending on how tsc decides to resolve packages, you might also need to `npm install vue` locally in the vue-typescript folder as well.  
**Don't forget to open an issue on the repo as well!**