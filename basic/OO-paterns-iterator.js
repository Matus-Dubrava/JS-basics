// ITERATOR PATTERN
// Iterator pattern solves one problem, that is, it provides simple way
// to access elements of a given object, one by one. This might seem trivial
// in case of arrays but that object might have a complex internal structure,
// it might be a tree or graph or whatever, but a consumer of this object
// should be able to work with its elements in a systematic manner even without
// the knowledge of its structure. So we may say that iterator pattern abstracts
// internal structure of an object away from us.

// So how does it work? The general idea is that object should provide us with
// "getNext" method which fetches the next element in that object. How the "getNext"
// method does that is up to the implementation, it will be defferent in case of
// array than in case of tree. We also have to specify the starting point
// of iteration and the point at which it ends. Usually, it is also convenient
// to implements methods such as "hasNext" which determines whether we have
// reached the end yet and "getCurrent" that returns the current element or pointer
// to the current element without advancing the iteration. Next we might also implement "rewind" method that
// resets the iteration pointer, so that we can iterate through the object
// more than once.

// Let's see how we can implement it using IIFE (immediatelly executed function
// expression), wrapping data in a closure and providing users with some
// interface (in our case that interface consists of the four, above mentioned, methods)
// that allows them to manipulate the internally stored data.
// If that sounds familiar to you, well it should, because it is the same pattern
// that we have used when we were building modules.

(() => {

  const myObj = (() => {

    let i = 0,
        data = [1, 2, 3, 4, 5];

    return {
      hasNext() { return i < data.length; },
      getNext() {
        if (!this.hasNext()) { return null; }

        elem = data[i];
        i += 1;
        return elem;
      },
      getCurrent() {
        if (!this.hasNext()) { return null; }
        return data[i];
      },
      rewind() { i = 0; }
    }

  })();

  console.log(myObj.getNext());  // <- 1
  console.log(myObj.getNext());  // <- 2
  console.log(myObj.getNext());  // <- 3
  console.log(myObj.getNext());  // <- 4
  console.log(myObj.getNext());  // <- 5
  console.log(myObj.getNext());  // <- null

  myObj.rewind();
  console.log(myObj.getCurrent()); // <- 1
  console.log(myObj.getCurrent()); // <- 1
  console.log(myObj.getNext());    // <- 1
  console.log(myObj.getNext());    // <- 2


})();

// This was rather contrieved example because we can easily iterate through an
// array with just for-loop or array's "forEach" method but if the data
// weren't a simple array, let's say DOM, then there is no single, correct,
// one solution fits all way to achieve that.

// ITERATING THROUGH DOM
// Suppose that we want to use the above pattern to create a function that
// takes one argument, DOM element, and returns iterator that fetches each
// element in its subtree, one by one.

// Again, there are multiple ways to solve this. For the sake of simplicity, we
// will turn
// DOM into array using DFS (depth first search) and then repeat the
// above code (note that this is not the best approach form the standpoint of
// performance for multiple reasons).

// Let's use this html code.

// <html>
//   <head>
//     <title>some title</title>
//   </head>
//   <body>
//     <div>
//       <p>some paragraph</p>
//       <ul>
//         <li><a>link 1</a></li>
//         <li><a>link 2</a></li>
//       </ul>
//     </div>
//     <script src="./test.js"></script>
//   </body>
// </html>

(() => {

  function getDOMIterator(element) {

    // helper function that searches the element's subtree,
    // turning it into array
    function DOMToArray(element) {
      // check if the obtained argument is an element node
      if (element.nodeType === 1) {
        data.push(element);
        Array.from(element.children).forEach((child) => {
          DOMToArray(child);
        });
      }
    }

    let i = 0,
        data = [];

    // populate data
    DOMToArray(element);

    // return iterator object that has access to data
    // via closure
    return {
      hasNext() { return i < data.length; },
      getNext() {
        if (!this.hasNext()) { return null; }

        elem = data[i];
        i += 1;
        return elem;
      },
      getCurrent() {
        if (!this.hasNext()) { return null; }
        return data[i];
      },
      rewind() { i = 0; }
    }
  }

  // fetch ul element and use it as argument to
  // getDOMIterator function
  const list = document.querySelector('ul'),
        listIterator = getDOMIterator(list);

  console.log(listIterator.getNext());   // <- ul
  console.log(listIterator.getNext());   // <- li
  console.log(listIterator.getNext());   // <- a
  console.log(listIterator.getNext());   // <- li
  console.log(listIterator.getNext());   // <- a
  console.log(listIterator.getNext());   // <- null

})();

// Now that we have seen how to implement iterator pattern from scratch, it is
// important to mention that JavaScript provides us with well known symbol
// Symbol.iterator. When any object defines it, then JavaScript knows how
// to handle that object in interation context (such as for-of loop, or spread operator).
// So how do it work? It needs to be a function that returns object with "next" method,
// which in turn returns object with two properties, value and done, each time it
// is called. Value holds, well.. next value, and done is a boolean flag that
// signals the end of iteration.

// There are basically two approaches how to implement Symbol.iterator's function,
// we can follow the above description step by step, or we can choose a little bit
// different path using generator function with yield statement.

// CLASSICAL APPROACH

(() => {

  const obj = {
    a: 1,
    b: 2,
    c: 3,
    d: 4,
    [Symbol.iterator]() {
      let keys = Object.keys(this),
          i = 0;

      return {
        // note the usage of arrow function here to prevent
        // execution context switching so that "this"
        // points to "obj", otherwise it would point to the
        // object that is being returned
        next: () => {
          const value = this[keys[i]];
          i += 1;
          const done = i > keys.length;

          return { value, done };
        }
      };
    }
  };

  for (const val of obj) { console.log(val); } // <- 1, 2, 3, 4

  console.log([...obj]); // <- [1, 2, 3, 4]

})();

// GENERATOR FUNCTION APPROACH

(() => {

  const obj = {
    a: 1,
    b: 2,
    c: 3,
    d: 4,
    *[Symbol.iterator]() {
      const keys = Object.keys(this);

      // note that we can't use "forEach" method here
      // because "yield" statement can be used only
      // direcly inside of a generator function (denoted by *)
      // where "forEach" is not such a function
      for (let i = 0; i < keys.length; i++) {
        yield this[keys[i]];
      }
    }
  };

  for (const val of obj) { console.log(val); } // <- 1, 2, 3, 4

  console.log([...obj]); // <- [1, 2, 3, 4]

})();
