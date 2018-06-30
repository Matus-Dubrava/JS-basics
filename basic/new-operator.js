(() => { //-----------------------------------------------------
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

})(); //---------------------------------------------------------

(() => { //---------------------------------------------------------
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

})(); //------------------------------------------------------------

(() => { //---------------------------------------------------------
// IMPROVED VERSION 2
// PROBLEM with the previous example is that it needs to be called with
// new operator and if we omit it then the function will still run
// but no new object will be created and 'this' will point to the
// global object (window or global depending on the environment in
// which we run the code) and new properties will be added to this object
// (if we are in a strict mode then we will get an error instead since)

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
  console.log(e.name); // <- TypeError because sue is undefined (implicit return)
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

})(); //------------------------------------------------------------

(() => { //---------------------------------------------------------
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
console.log(Object.getPrototypeOf(sue1)); // <- prints object

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

})(); //------------------------------------------------------------
