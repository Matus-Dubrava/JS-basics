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

// First, we will see how to implement it using IIFE (immediatelly executed function
// expression), wrapping data in a closure and providing consumer with some
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
// weren't a simple array, but let's say DOM, then there is no single, correct,
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

}());
