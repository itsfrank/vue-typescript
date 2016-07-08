# vue-typescript
Typescript decorators to make vue play nice with typescript

[![https://circleci.com/gh/itsFrank/vue-typescript](https://img.shields.io/circleci/project/itsFrank/vue-typescript.svg??style=flat-square)]()
[![https://codecov.io/gh/itsFrank/vue-typescript](https://img.shields.io/codecov/c/github/itsFrank/vue-typescript/master.svg)]()
[![https://www.npmjs.com/package/vue-typescript](https://img.shields.io/npm/v/vue-typescript.svg)]()

## Why do i need this?
I build this mostly to remove the red squiggles on VSCode, but also to make Vue work seamlessly while still writing code that feels like typescript.

While you can just declare all your components as 'any' and carry on, you lose all the fantastic features of typescript. However, i also wanted to make sure i still had access to the entirety of Vue's features, so vue-typescript is built in such a way that you can chose how much of it you want to use and how much you would rather stick to standard Vue.

# Install
This package has one single peer-dependancy: Vue (obviously) 

```
npm install --save vue-typescript
```

# Current Features
- **@VueComponent** - A class decorator that registers the class as a components
- **@Prop** - A variable decorator that adds a class' variables to the prop object

**See planned features below for other decorators that are in the works
# Usage
### **@VueComponent**
There are 4 ways to call it:
    
&nbsp;&nbsp;&nbsp;&nbsp;**@VueComponent**\
&nbsp;&nbsp;&nbsp;&nbsp;**@VueComponent(element:string)**\
&nbsp;&nbsp;&nbsp;&nbsp;**@VueComponent(options:ComponentOption)**\
&nbsp;&nbsp;&nbsp;&nbsp;**@VueComponent(element:string, options:ComponentOption)**\
&nbsp;&nbsp;&nbsp;&nbsp; element - string to use as html tag\
&nbsp;&nbsp;&nbsp;&nbsp; options - the same object as the one you would use when calling Vue.component\

By default, the tag will be the snake-case version of the class name, and options will be an empty object {} 

### **@Prop**
There are 2 ways to call it:
    
&nbsp;&nbsp;&nbsp;&nbsp;**@Prop**\
&nbsp;&nbsp;&nbsp;&nbsp;**@Prop(options:PropOption)**\

&nbsp;&nbsp;&nbsp;&nbsp; options - the same object as the one you would use defining a prop\

By default, the prop will behave as the equivalently to &nbsp;`myProp: null`



# Behaviour
- **Variables** - unless the @Prop decorator is used, all variables in a class will be returned by the data object
- **Functions** - all functions that do not match the name of a Vue lifecycle hook will be put in the methods objec. Any function named like one of the hook (ex: 'ready()') will be added as a property of the options object and not to methods (see second example)
- **Option Object** - the option object allows to access features that may not have been implemented yet by vue-typescript, or simply offers the option to have a hybrid vanilla vue / typescript object. However, is a property is defined in bot the options obect and the class, the class variable will overwrite the one in options. 
- **Constructors** - Avoid defining constructors to classes that will be used as components, an instance of the object is created at load time to create a vue object and register the component, if the constructor relies on parameters, there will be undefined errors as these parameters will obviously not be passed.

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
        doStuff(){
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
})
class MyDopeComponent extends Vue { //extend Vue to get intelisense on vm functions like $broadcast()
    lookAtMe:string;

    ready() {
        this.lookAtMe = 'Ive changed';
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
        itChanged(new){
            this.$broadcast('New var: ' + this.lookAtMe);
        }
    },
    ready() {
        this.lookAtMe = 'I've changed';
    }
})
```

# Planned Features
- **@Watch** - a function decorator that will take as parameter the watched variable's name and add the function to the watch object
- **@Computed** - a function decorator that will add the function to the computed object instead of the method object