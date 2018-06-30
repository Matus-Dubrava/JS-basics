"use strict";

// PROBLEM: how to create a function that will produce new objects according to
// our linking.

(() => {
// defining a constructor function
function Person(name, age) {
  this.name = name;
  this.age = age;
  this.getDescription = function() {
    return `Person ${this.name}, ${this.age}`;
  };
}

// calling Person function with new operator creates a new object
// and sets 'this' reference to point to that newly created
// object.

// Then the function is executed line by line as a normal function
// would be (there is actually nothing special about this so called
// constructor function)

// When the end of the function block is reached, that newly created
// object is returned unless some other object was returned explicitely
// using return statement
const sue = new Person('sue', 20);
console.log(sue.getDescription());

})();

// -----------------------------------------------------------------------------

(() => {
// IMPROVED VERSION 1
// PROBLEM with the previous example is that each time a new object is
// created, the 'getDescription' method is copied to it. So we are
// creating a copy of a method event though it stays the same for
// each object.

// SOLUTION: move the 'getDescription' method from the constructor to
// the prototype of the newly created object
function Person(name, age) {
  this.name = name;
  this.age = age;
}

Person.prototype.getDescription = function() {
  return `Person ${this.name}, ${this.age}`;
};

const sue = new Person('sue', 20);
console.log(sue.getDescription());

// Now there is only one instance of 'getDescription' method no
// matter how many object we will create

})();

// -----------------------------------------------------------------------------

(() => {
// IMPROVED VERSION 2
// PROBLEM with the previous example is that it needs to be called with
// new operator and if we omit it then the function will still run
// but no new object will be created and 'this' will point to the
// global object (window or global depending on the environment in
// which we run the code) and new properties will be added to this object
// (if we are in a strict mode then we will get an error instead)

function Person(name, age) {
  this.name = name;
  this.age = age;
}

Person.prototype.getDescription = function() {
  return `Person ${this.name}, ${this.age}`;
};

const sue = Person('sue', 20);

try {
  console.log(sue.name);
} catch (e) {
  console.log(e.name); // <- TypeError because sue is undefined (implicit function return)
}

console.log(global.name); // <- we have accidentaly added 'name' property to
                          // the global object

// SOLUTION: don't rely on implicitly created and returned object using 'new'
// operator, but instead create and also return the new object by yourself

function Person(name, age) {
  const obj = {};
  obj.name = name;
  obj.age = age;
  return obj;
}

Person.prototype.getDescription = function() {
  return `Person ${this.name}, ${this.age}`;
};

const sue1 = new Person('sue', 20);
const sue2 = Person('sue', 20);

console.log(sue1.name);
console.log(sue2.name);

// now calling the Person function with new or without behaves the same
// (well, almost)

})();

// -----------------------------------------------------------------------------

(() => {
// IMPROVED VERSION 3
// PROBLEM with the improved version 2 is in the way in which we have
// created the new object. That is, we have forgotten to tell it to
// use the correct prototype.

function Person1(name, age) {
  const obj = {};
  obj.name = name;
  obj.age = age;
  return obj;
}

Person1.prototype.getDescription = function() {
  return `Person ${this.name}, ${this.age}`;
};

const sue1 = Person1('sue', 20);
console.log(Object.getPrototypeOf(sue1)); // <- prints default object (not something that we want to)

try {
  console.log(sue1.getDescription());
} catch (e) {
  console.log(e.name); // <- TypeError because 'getDescription' can't be found
}                      // on the sue object (which is desired) but it also
                       // can't be found nowhere in the prototype chain leading
                       // from that object (bug in our code you may say)

// SOLUTION: use 'Object.create()' method to create the new object and pass it
// the correct prototype object instead of using object literals.

function Person2(name, age) {
  const obj = Object.create(Person2.prototype);
  obj.name = name;
  obj.age = age;
  return obj;
}

Person2.prototype.getDescription = function() {
  return `Person ${this.name}, ${this.age}`;
};

const sue2 = Person2('sue', 20);
console.log(Object.getPrototypeOf(sue2)); // <- prints the correct prototype object
console.log(sue2.getDescription());       // <- works as expected

})();

// -----------------------------------------------------------------------------

(() => {
// BE AWARE OF 1.: using ES6 arrow funtion with constructor function that still
// uses 'new' will not work because arrow function doesn't have a constructor
// property that is necessary for this process.

const Person1 = (name, age) => {
  this.name = name;
  this.age = age;
}

try {
  const sue = new Person1('sue', 20);
} catch (e) {
  console.log(e.name); // <- TypeError Person is not a constructor function
}

// arrow function can't be used as a constructor function even is we improve it
// as mentioned before to not use 'new' operator because there is not prototype
// object created and associated with arrow functions

const Person2 = (name, age) => {
  const obj = Object.create(Person2.prototype); // <- Person2.prototype is undefined
  obj.name = name;
  obj.age = age;
  return obj;
}


try {
  const sue = Person2('sue', 20);
} catch (e) {
  console.log(e.name); // <- TypeError: we can't pass undefined to the Object.create
}                      // function (only an actual object or null are allowed)


})();

// -----------------------------------------------------------------------------

(() => {
// BE AWARE OF 2.: using arrow function to define a method on a function prototype
// will fail because arrow function doesn't have its own 'this' (you may say that
// it takes 'this' from its enclosing scope or that it uses lexical 'this')

function Person(name, age) {
  const obj = Object.create(Person.prototype);
  obj.name = name;
  obj.age = age;
  return obj;
}

Person.prototype.getDescription = () => {
  return `Person ${this.name}, ${this.age}`;
};

const sue = new Person('sue', 20);
console.log(sue.getDescription()); // <- here we get "Person undefined, undefined"
                                   // because 'this' in this case points to the
                                   // execution context of the enclosing scope
                                   // instead of our person which
                                   // doesn't have properties name and age

// we can verify the previous claim about 'this' pointing to the enclosing
// scope's execution context by associating the mentioned properties with it.

this.name = 'enclosing-Sue';
this.age = 'enclosing-20';
console.log(sue.getDescription()); // <- prints "Person enclosing-Sue, enclosing-20"

})();

// -----------------------------------------------------------------------------

(() => {
// BE AWARE OF 3.: Things can be simplified if we don't need a custom
// prototype (just be sure to understand that the newly created object will
// still have the default object prototype)

function Person1(name, age) {
  return {
    name: name,
    age: age
  };
}

const sue1 = Person1('sue', 20);
console.log(sue1);

// which can be simplified even more using object properties shorthand notation

function Person2(name, age) {
  return {
    name,
    age
  };
}

const sue2 = Person2('sue', 20);
console.log(sue2);

// and since we are not relying on 'new', 'this' or prototype in this case, we
// can also use arrow function

const Person3 = (name, age) => {
  return {
    name,
    age
  };
};

const sue3 = Person3('sue', 20);
console.log(sue3);

// and to simplify it even more, we can omit return statement and curly braces
// defining the function block but we need to wrap the object to be returned with
// parenthesis so that it is recognized as an object an not as a function block

const Person4 = (name, age) => ({ name, age });

const sue4 = Person4('sue', 20);
console.log(sue3);

})();

// -----------------------------------------------------------------------------

(() => {
// BE AWARE OF 4.: If we want to use a function to create a new object but we
// don't want that object to have any prototype (not even the default object
// prototype), we can use Object.create function again, but pass it 'null' this
// time.

function Person(name, age) {
  const obj = Object.create(null);
  obj.name = name;
  obj.age = age;
  return obj;
}

const sue = Person('sue', 20);
console.log(sue);
console.log(Object.getPrototypeOf(sue)); // <- in this case, sue's prototype is null
                                         // not a custom and not even the default
                                         // object prototype

})();
