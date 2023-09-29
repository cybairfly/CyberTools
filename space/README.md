# Cyber Space
Minimal library for centralized state management and automated state change logging/debugging.

# Installation
```
npm i cyber-space
```

# Utilization

1. **(recommended option)** extend the class and define your custom types for autocompletion
```js
class CyberSpace extends Space {
    /**
     * Custom types for variables you wish to store in this space
     * @type {types.Space}
     */
    state;
}
```

OR (*"root mode"*)

```js
class CyberSpace extends Space {
    
    /** @type {number} */
    field_1;

    /** @type {string} */
    field_2;

    /** @type {boolean} */
    field_3;
}
```


2. import the space in your code and access or store your variables with autocomplete enabled

```js
const fun = ({space}) => space.state.field_1;
const fun = ({space: {state}}) => state.field_1;

class Class {
    constructor
}
```