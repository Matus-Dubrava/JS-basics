// SINGLETON PATTERN
// The idea behind singleton pattern is simple, we have some class and each time
// we instantiate it, instead of getting new object we receive a pointer to the
// object that was produced by this class the first time. Or in other words,
// class can produce only one unique object.

// Now, we don't have classes in JavaScript and if we want to create a single, let's
// say configuration, object, all we have to do is use object literals to create
// it, therefore everything that follows is manly of theoretical interest.
// One thing that we do have in JavaScript is the "new" operator so we can try to implement constructor function
// in such a way that it always returns pointer to the same object.

// APPROACH NO 1. - storing the already produced object in some property of a
// function (we can assign properties to functions as they are objects as well)

(() => {

  function Singleton() {
    // if instance has already been created and stored, return it instead of
    // producing a new one
    if (typeof Singleton.instance === 'object') {
      return Singleton.instance;
    }

    this.start = 0;
    this.version = '1.1.2';
    // store newly created instance in a property of this function
    Singleton.instance =  this;
  }

  const sing1 = new Singleton();
  const sing2 = new Singleton();

  console.log(sing1);
  console.log(sing2);
  console.log(sing1 === sing2);

})();

// The last line reports "true" so those object are really the same, because
// JavaScript compares references in case of objects, not values.

// APPROACH 2. - using closure to store the instance
// There are a few ways how to create a closure and store someting in it
// but we will consider only one of them which uses IIFE (imediatelly executed
// function expression). The idea is pretty similar to the one that is
// used to create a module in JavaScript, well it is actually the same idea,
// so technically, there is not difference between module a singleton
// JavaScript.

(() => {

  const Singleton = (() => {
    // closure over instance
    let instance = undefined;

    // can't use arrow function here, as it doesn't work as constructor
    return function Singleton() {
      if (instance) { return instance; }

      this.start = 0;
      this.version = '1.1.2';
      instance = this;
    };
  })();

  const sing1 = new Singleton();
  const sing2 = new Singleton();

  console.log(sing1);
  console.log(sing2);
  console.log(sing1 === sing2);

})();

// The advantage of this approach over the first one is that instance in this
// case is not directly visible because it is hidden inside of a closure, but
// we still have to be careful about changing the obtained object as it refers
// to the same object as the instance stored in a closure, which means that
// if we change one, those changes are visible across all the produced objects
// as well.

// In some cases, this behaviour might be prefferable, in others not. So how
// can we do something about that? One solution is to make the instance object
// immutable so that nothing can change it once it has been created.

(() => {

  const Singleton = (() => {
    // closure over instance
    let instance = undefined;

    // can't use arrow function here, as it doesn't work as constructor
    return function Singleton() {
      if (instance) { return instance; }

      this.start = 0;
      this.version = '1.1.2';
      instance = this;

      // freeze the instace, preventing future changes
      Object.freeze(instance);
    };
  })();

  const sing1 = new Singleton();
  const sing2 = new Singleton();

  console.log(sing1);
  console.log(sing2);
  console.log(sing1 === sing2);

})();

// Using Object.freeze, we are able to prevent any changes to the instance
// object, so even if someone tries to modify, let's say, "sing1" in our example,
// such action will fail (silenty or with an error, depending on the environment in
// which that code is run).

// Word of caution, Object.freeze ensures only what is called a shallow immutability
// (similar to making a shallow copy), which means that objects that are stored
// in some property of a frozen object can still be mutated.
