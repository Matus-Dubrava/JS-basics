"use strict";

// FUNCTIONS

// Functions in JavaScript are just objects that can be called. We usually
// say terms such as 'first-class objects' or 'first-class citizens' which
// means that we can do the same things with functions as with the other values:
// - we can assign function to a variable
// - we can pass function as an argument to another function (usually reffered as a callback)
// - we can return function from another function
// - we can add property to a function

// -----------------------------------------------------------------------------

(() => {
// FUNCTION IS AN OBJECT
// It has its own constructor so we can create a function by passing a string,
// that should be a  valid JavaScript code, to the Function constructor.
// But don't do this. It is always considered a bad practice (ass bad as using
// 'eval') and brings a serious security issue with itself and there is always
// a better option.

var sayHi = new Function('const message = "hi"; console.log(message);');
sayHi();

})();

// -----------------------------------------------------------------------------

(() => {
// HOW TO DEFINE A FUNCTION
// We can use function definition.

function message1(msg) {
  console.log(msg);
}

message1('hi');

// We can use unnamed function expression and assign it to a variable. Using this
// pattern has some downsides to it. First of all, when we are debugging a program,
// it is much easier to trace down a bug when we see names of functions that
// were called. Another issue is that the name property of a function might not
// be present (it depends on implementation), and if it is not then we are not
// able to call this function from within itself in case that we want it to
// be a recursive function.

var message2 = function(msg) {
  console.log(msg);
};

message2('hi');

// And in the same manner, we can create a function as in the previous example
// using function expression but with an additional function name.

var message3 = function message3(msg) {
  console.log(msg);
};

message3('hi');


})();

// -----------------------------------------------------------------------------

(() => {
// HOW TO DEFINE A FUNCTION - HOISTING
// One of the differences between defining of function using function declaration
// and function expression is their visibility throughtout the scope in which
// they were defined.

// Function declarations are always visible and can always be used. In the next
// example, we are calling the 'foo' function sooner than it is defined. This
// works because function declarations are hoisted to the top of the scope in which
// they were defined.

foo();

function foo() {
  console.log('foo');
}

// Assigning a function expression to a variable works differenly. If we structure
// our code as in the previous example, but switch function declaration for function
// expression, we will get an error instead.

try {
  bar();   // <- this will be the cause of type error (not a reference error due to hoisting)
} catch (e) {
  console.log(e.name);
}

var bar = function() {
  console.log('bar');
};

// The error occured because only the variable declaration was hoisted, not the
// assignment to that variable. Meaning that at the time we are calling the 'bar'
// function, variable bar has been hoisted to the top of the scope (that is why
// we are getting type error instead of reference error) but it has no value
// assigned to it yet.

// If we use 'const' or 'let' keywords to declare a variable instead of 'var', we
// will get reference error because variables declared using 'const' and 'let' are
// not visible until they are actually declared (they are still being hoisted to
// the top of the scope but they are just not visible to us, they enter what is
// usually called a TDZ - temporary dead zone and they leave TDZ only after
// the execution of a program reaches the line at which the were declared).

try {
  baz();   // <- here we get reference error
} catch (e) {
  console.log(e.name);
}

const baz = function() {
  console.log('baz');
};

})();

// -----------------------------------------------------------------------------

(() => {
// IIFE - immediatelly executed function expression
// We can execute a function expression as soon as we create it without the need
// of assigning it to a variable by wrapping it in parentheses and then using '()'
// syntax to execute it.

(function() {
  console.log('IIFE');
})();

// This is a usefull pattern in many regards. First, if we want to perform some
// logic that involves creation of some variables, but that action needs to be
// performed only once, then we can use IIFE to enclose those variables with a
// function scope without polution of the global name space.

(function() {
  const a = 1;
  const b = 2;

  console.log(a + b);
})();

// We can also pass arguments to IIFE.

(function(a, b) {
  console.log(a + b);
})(10, 20);

// And return from IIFE the same way we would return from a normal function call.

const res = (function(a, b) {
  return a + b;
})(100, 200);

console.log(res);

// Another use case would be to use IIFE as a one shot function factory that
// returns another function and hides some variables from the outer scopes.
// Let's assume that we want to create a function 'counter' that will start
// from 0 and each time it is called, it returns the next number.

// APPROACH 1 (antipattern) - using global variable to store the counter's state.

let currentNumber1 = 0;

const counter1 = function() {
  currentNumber1 += 1;
  return currentNumber1;
}

console.log(counter1()); // <- prints 1
console.log(counter1()); // <- prints 2
console.log(counter1()); // <- prints 3

// This approach is wrong in many ways. One disadvantage is that we are poluting
// global scope which is never a good idea. Anyone, who has access to global scope
// can change it and break our function. Suppose that another piece of code is also
// using a global variable called 'currentNumber' but for a different purposes and
// changes it.

// some random function that incidentaly changes our 'currentNumber' variable
function foo() {
  currentNumber2 = 'zero';
}

let currentNumber2 = 0;

foo();

const counter2 = function() {
  currentNumber2 += 2;
  return currentNumber2;
}

console.log(counter2()); // <- prints zero2
console.log(counter2()); // <- prints zero22
console.log(counter2()); // <- prints zero222

// Next thing is that we are creating
// an unnecessary side effect, meaning that the function can't be seen as a
// single independant unit of computation, but it is coupled with the state
// of external environment. This has a negative impact on testability and
// reusability of that function. (we will get back to this topic later when will
// be discussing functions from the perspective of functional programming).

// APPROACH 2 - using another function to wrap the 'currentNumber' in its scope
// and return a new function that will have access to this variable via closure.

function createCounter() {
  let currentNumber = 0;

  return function() {
    currentNumber += 1;
    return currentNumber;
  };
}

const betterCounter1 = createCounter();

console.log(betterCounter1()); // <- prints 1
console.log(betterCounter1()); // <- prints 2
console.log(betterCounter1()); // <- prints 3

// Now this approach is better because 'currentNumber' is not longer poluting
// global scope and nobody except of the returned funcion can manipulate it.
// One possible downside is that we are still poluting global scope with 'createCounter'
// function name. If we plan to reuse this function then it is completly fine but
// if it has only one time use then we should switch to IIFE patter instead.

const betterCounter2 = (function () {
  let currentNumber = 0;

  return function() {
    currentNumber += 1;
    return currentNumber;
  }
})();

console.log(betterCounter2()); // <- prints 1
console.log(betterCounter2()); // <- prints 2
console.log(betterCounter2()); // <- prints 3

// Now we have just one function called 'betterCounter2' that doesn't rely
// on external state because it stores its state in a closure that is inaccessible
// to anyone else.

// If we would want to create a counter that doesn't start with 0 but some
// other number, we can pass it as an argument to the anonymous function that is used to
// create our counter function. In the example below, our counter function starts
// counting from 10.

const betterCounter3 = (function (start) {
  let currentNumber = start;

  return function() {
    currentNumber += 1;
    return currentNumber;
  }
})(9);

console.log(betterCounter3()); // <- prints 10
console.log(betterCounter3()); // <- prints 11
console.log(betterCounter3()); // <- prints 12

// We don't actually need to declare additional variable inside of a the anonymous
// function to store and use the variable from the function header to handle
// that job.

const betterCounter4 = (function (currentNumber) {
  return function() {
    currentNumber += 1;
    return currentNumber;
  }
})(9);

console.log(betterCounter4()); // <- prints 10
console.log(betterCounter4()); // <- prints 11
console.log(betterCounter4()); // <- prints 12

// And this code can be further simplified if we use ++ operator instead of += 1.

const betterCounter5 = (function (currentNumber) {
  return function() {
    return ++currentNumber;
  }
})(9);

console.log(betterCounter5()); // <- prints 10
console.log(betterCounter5()); // <- prints 11
console.log(betterCounter5()); // <- prints 12

// We can also use arrow function to make it even more concise (more about
// arrow functions later).

const betterCounter6 = ((currentNumber) => () => ++currentNumber)(9);

console.log(betterCounter6()); // <- prints 10
console.log(betterCounter6()); // <- prints 11
console.log(betterCounter6()); // <- prints 12

})();

// -----------------------------------------------------------------------------

(() => {
// PASSING FUNCTION AS AN ARGUMENT TO ANOTHER FUNCTION
// Since functions in JavaScript are just object, we can pass them to another
// function as an argument (this is usually refered to as a callback). This
// pattern allows us to simplify some tasks and make functions to focused, meaning
// that the function will solve only one problem, which is necessary if we
// want that function to be as reusable as possible.

// Let's start with a simple example. Suppose that we have an array of integers and
// we want to increase all of its entries by one.

// APPROACH 1.: function that handles the whole task

const increaseByOne = function(arr) {
  for (let i = 0; i < arr.length; i++) {
    arr[i] += 1;
  }
};

const arr1 = [1, 2, 3];
increaseByOne(arr1);
console.log(arr1);  // <- prints [1, 2, 3];

// While this is a valid solution, it has some downsides. Imagine that the task
// changes and now you need to increase the entries not by one, but two. Well,
// we could possibly invoke 'increaseByOne' function twice one a given array but
// that would be terribly innefective.

// Better approach would be to create more flexible function that would take any
// number as its second argument and increase the provided array by that value.

const increaseByX = function(arr, x) {
  for (let i = 0; i < arr.length; i++) {
    arr[i] += x;
  }
};

const arr2 = [1, 2, 3];
increaseByX(arr2, 2);
console.log(arr2);

// As we can see, this is considerably better approach because next time when
// someone asks us to increase the entries of an array by arbitrary value, we
// can simply reuse this function. But what if the tasks changes and instead
// of increasing those entries we will need to decrease them, then we are
// back at the beginning because our function is still a bit more specific then
// it needs to be.

// It is always a good idea to design your function in a way that they are used
// to solve only one task. Sure our function is solving only a single task, but
// does it really? In fact, it solves two tasks at once. It iterates through
// the array, that is the first task, and the second one is that it modifies
// the entries of the array in some, rather specific, way.

// Let's make it such that it can apply any logic to those entries by
// taking an arbitrary function compatible with it an applying this function on
// each entry (and let's give it a more general name, 'map' sounds about right).

const map = function(arr, cb) {
  for (let i = 0; i < arr.length; i++) {
    arr[i] = cb(arr[i]);
  }
};

const add100 = function(x) {
  return x + 100;
};

const arr3 = [1, 2, 3];
map(arr3, add100);
console.log(arr3);

// If 'add100' will be reused anymore (which it probably won't since it is really
// too specific), we can omit declaration of that function and pass an
// anonymous function expression to our mapping function.

const arr4 = [1, 2, 3];

map(arr4, function(x) {
  return x + 100;
});

console.log(arr4);

// And that is basically it. This function is actually a pretty useful one and
// many programming languages include it in their core implementation, JavaScript
// included (but it wasn't always the case). But unlike our implementation, JavaScript
// has 'map' function as a method of array's prototype (Array.prototype.map) and
// while it is used to solve the same task, it is quite different in how it achieves
// that. Once crutial difference is that it doesn't mutate the provided array,
// instead it returns a new modified one keeping the original intact.
// Another difference is that it is a method, so it needs an array as its execution
// context (our function doesn't work with and doesn't need any specific execution context).
// There is also a difference in signatures of these two functions but let's cut it
// here, see some quick example and return to this topic later.

const arr5 = [1, 2, 3];
const newArray = arr5.map(function(v) {
  return v + 100;
});

console.log(newArray);

})();

// -----------------------------------------------------------------------------

(() => {
// PASSING FUNCTION AS AN ARGUMENT TO ASYNCHRONOUS FUNCTION
// We have already seen how we can pass one function to another one as
// a callback to simplify our code and make the functions more reusable but
// there are cases when it would be really hard to work witout this pattern, that
// is, asynchronous programming.

// You may say that JavaScript is an event driven programming language it solves many
// tasks asynchronously. Let's start with a simple example of
// 'setTimeout' function which takes two arguments, callback and a delay and
// all it does is that it executes the provided callback after certain amount
// of time has passed which is given by the delay argument (it is actually more
// complicated than that and we should probably say that it is guaranteed that
// the callback will not be executed sooner then we specify by the delay argument
// and it has to do with how JavaScript really works, but for that we would
// need to know about call stack, web/node apis, callback queue and event loop, which
// is an advanced topic that we will discuss fully much later).
// So here is our first example.

setTimeout(function () {
  console.log('log after one second');
}, 1000);

// Here we are passing an anonymous function to the 'setTimeout' to postpone its
// execution. It might not be obvious why we would want to do that in a first place,
// but let's wait a bit and see how we can pass a function that we have already
// declared somewhere in our code to this 'setTimeout'.

const sayHello = function() {
  console.log('hello');
};

setTimeout(sayHello, 1000);

// This works as expected, now let;s make things a little bit more complicated
// and pass some arguments to such callback.

const sayHelloToSomeone = function(who) {
  console.log(`hello ${who}`);
};

try {
  setTimeout(sayHelloToSomeone('Sue'), 1000);
} catch (e) {
  console.log(e.name);
}

// This will not work as expected and depending on the environment in which
// we run this code, we will might get an error. But we can still see that
// string 'hello Sue' is printed right away and it doesn't wait that specified
// one second. The reason behind this is that first parameter of 'setTimeout'
// expect a function but we are actually executing the 'sayHelloToSomeone' right
// away and instead of function, we are passing 'undefined' (implicit return) to
// the 'setTimeout'. This is actually a common gotcha and a favorite question
// during interviews.

// So how do we solve it, how do we pass arguments to function without calling it?
// Well, there are two approaches to this problem. We can either pass a diffrent,
// anonymous function to the 'setTimeout' and execute 'sayHelloToSomeone' inside
// of its body in a normal way, or we can use a technique from functional programming
// called partial application.

// Let's start with the first approach, that is, using another anonymous function.

setTimeout(function() {
  sayHelloToSomeone('Sue');
}, 1000);

// And for the second approach, JavaScript implements a method on Function prototype
// called 'bind' (Function.prototype.bind), first argument provided to it is used to bind an
// execution context to the function (we will pass 'null' here as our function
// doesn't need any specific execution context) and the next arguments are partially
// applied to the provided function. Bind returns a new function that is just
// like the original one but it reduces its arity and hard-binds the specified
// arguments as well as execution context (in reality, it is more complicated than
// that, the returned function is what is called an exotic object which doesn't have
// a prototype anymore and its execution context can't be rebound but this
// is something that we don't need to care about most of the time).

setTimeout(sayHelloToSomeone.bind(null, 'sue'), 1000);

// Let's step move one and consider 'addEventListener' method (in case that we
// are running JavaScript in browser) that listens for a
// specific event and takes callback that handles the event, usually called
// event handler.

(() => {
  const $shoppingCart = document.querySelector('#shoppingCart');

  $shoppingCart.addEventListener('click', function() {
    // handle the event which is triggered by user clicking on
    // our shopping cart
  });
});

// In this case, we don't specify when exacly the event will happen, it might
// not happen at all. What we are doing is that we are just saying something along
// the line - hey JavaScript, if this event occurs one day, be prepared
// and execute this kind of logic (prvided callback).

// Another example, from the Node.js environment this time, would be to read a content of a
// file. Tasks like this, you may say IO tasks, are considered slow and for
// us to be able to handle them effectively, we can either run them concurrently in a different
// exection threads (well... we can't, JavaScipt is single threaded, sorry) or
// we can run them asynchronously (this is where JavaScipt really shines).

(() => {
  const fs = require('fs');

  fs.readFile('path-to-your-file', 'utf-8', function(err, data) {
    if (err) {
      // some error occured and JavaScipt wasn't able to read the file
      console.log(err);
    } else {
      // do whatever you want to do with the obtainded data
      console.log(data);
    }
  });
});

// Here we are requiring the 'fs' filesystem module and useing its 'readFile' method
// which takes three arguments - path to the file we want to read, encoding and
// the most interesting one, callback. This callback, again, is executed once JavaScript
// is done with reading of that file, it takes has two parameters - error, and data
// and we can either handle the error if there is some, or handle the obtained data.

})();
