# vue-typescript
Typescript decorators to make vue play nice with typescript

[![https://circleci.com/gh/itsFrank/vue-typescript](https://img.shields.io/circleci/project/itsFrank/vue-typescript.svg??style=flat-square)]()
[![https://codecov.io/gh/itsFrank/vue-typescript](https://img.shields.io/codecov/c/github/itsFrank/vue-typescript/master.svg)]()
[![https://www.npmjs.com/package/vue-typescript](https://img.shields.io/npm/v/vue-typescript.svg)]()

## Why do i need this?
I built this mostly to remove the red squiggles on VSCode, but also to make Vue work seamlessly while still writing code that feels like typescript.

While you can just declare all your components as 'any' and carry on, you lose all the fantastic features of typescript. However, i also wanted to make sure i still had access to the entirety of Vue's features; so vue-typescript is built in such a way that you can pick and chose how much of it you want to use and what you would rather stick to standard Vue syntax for.

# Install
This package has one single peer-dependancy: Vue (obviously) 

```
npm install --save vue-typescript
```

# Current Features
- **@VueComponent** - A class decorator that registers the class as a vue component
- **@Prop** - A variable decorator that adds a class' variables to the prop object instead of data

**See planned features below for other decorators that are in the works
# Usage
##### @VueComponent
There are 4 ways to call it:
    
&nbsp;&nbsp;&nbsp;&nbsp;**@VueComponent**  
&nbsp;&nbsp;&nbsp;&nbsp;**@VueComponent(element:string)**  
&nbsp;&nbsp;&nbsp;&nbsp;**@VueComponent(options:ComponentOption)**  
&nbsp;&nbsp;&nbsp;&nbsp;**@VueComponent(element:string, options:ComponentOption)**  
&nbsp;&nbsp;&nbsp;&nbsp; element - string to use as html tag  
&nbsp;&nbsp;&nbsp;&nbsp; options - the same object as the one you would use when calling Vue.component  

By default, the tag will be the snake-case version of the class name, and options will be an empty object { } 

##### @Prop
There are 2 ways to call it:
    
&nbsp;&nbsp;&nbsp;&nbsp;**@Prop**  
&nbsp;&nbsp;&nbsp;&nbsp;**@Prop(options:PropOption)**  

&nbsp;&nbsp;&nbsp;&nbsp; options - the same object as the one you would use defining a prop  

By default, the prop will behave equivalently to having &nbsp;`myProp: null` &nbsp; in the props object



# Behaviour
- **Variables** - unless the @Prop decorator is used, all variables in a class will be returned by the data object
- **Functions** - all functions that do not match the name of a Vue lifecycle hook will be put in the methods object. Any function named like one of the hook (ex: 'ready()') will be added as a property of the options object and not to methods (see second example)
- **Option Object** - the option object allows to access features that may not have been implemented yet by vue-typescript, or simply offers the option to have a hybrid vanilla vue / typescript component. However, is a property is defined in bot the options obect and the class, the class variable will overwrite the one in options. 
- **Constructors** - Avoid defining constructors for classes that will be decorated by @VueComponent. An instance of the object is created at load time to create a vue object and register the component, if the constructor relies on parameters, there will be 'undefined' errors as these parameters will obviously not be passed.

# Examples

### Pure Typescript:
```Typescript
import * as Vue from 'vue'
import { VueComponent, Prop } from 'vue-typescript'

@VueComponent
class MyComponent {
    @Prop someProp:string;
    @Prop({
        default: 'something'
    })
    someDefaultProp:string; //if a value is assigned here it will be ignored

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
            default: 'something'
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
    component: new HomeView()
  }
});

router.start(app, '#my-app');
```

#### Note on using `new` with component classes
Calling something like `new MyComponent()` will actually not construct a new component, neither will it re-register it with vue. All components are registered at load time, calling new on the class is equivalent to getting a reference to the return of `Vue.component('my-component', {...})`, this function is only evaluated once, and the retuern is stored internally by vue-typescript. This is why in the vue-router example, we need to put `new` in front of our class.

# Planned Features
- **@Watch** - a function decorator that will take as parameter the watched variable's name and add the function to the watch object
- **@Computed** - a function decorator that will add the function to the computed object instead of the method object