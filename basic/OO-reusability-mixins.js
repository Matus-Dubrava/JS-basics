// Now that we know how to imitate (sort of) class based inheritance in
// JavaScript, let's look at how we can achieve reusability of a code
// that we, or someone else, have already written without the need of
// constructors.

// ------------------------------------------------------------------------
// OBJECT COPYING
// Suppose that we have an object with some useful properties and we want to
// reuse it somewhere in our code, possibly extend it, but we don't want
// to change the original one, or in other words, we want to make a copy
// of that object. So how can we achieve it?

(() => {

  const original = {
    version: 1,
    status: 'cool'
  };

})();

// Here is our original object. Frist thing that we can try is to assign this
// object to another one.

(() => {

  const original = { version: 1, status: 'cool' };

  const newOne = original;

  // true, newone and original are the same
  console.log(newOne === original);

  newOne.version = 2;
  console.log(newOne.version);     // 2
  console.log(original.version);   // 2 ups...

})();

// Ok, apparently it not that easy. What happened here is that objects in
// JavaScript are passed by reference not by value, so we have simply set
// "newOne" variable to point to the same object as the "original". This means
// that when we make any changes to the object refered by "newOne", those
// changes will affect object refered by "original" as it is still the same
// object. Let's try something a little bit more involded and create a
// "copy" function that will move, one by one, properties from the original
// object to a new one.

(() => {

  const copy = (source) => {
    // this will be our new object
    const result = {};

    // let's loop through properties of the original object
    // but we want to copy only own properties from it
    Object.getOwnPropertyNames(source).forEach((prop) => {
      result[prop] = source[prop];
    });

    return result;
  };

  const original = { version: 1, status: 'cool' };

  const newOne = copy(original);

  // false, newone and original are not the same
  console.log(newOne === original);

  newOne.version = 2;
  console.log(newOne.version);    // 2
  console.log(original.version);  // 1


// This approach seams to be working but, unfortunatelly, we are not done yet.
// As we can see, it works because instead of simply assigning the original object
// to a new one, we are copying its properties to that new object. But what if some
// properties of the original object are objects themselves? Put simply, it fails.
// Or more precisely, we fell into them same trap of assigning object reference to
// variable "result[prop] = source[prop];" is the same as "const newOne = original;"
// in case when "source[prop]" is object. This is also known as shalow copy.

  const original1 = { myArray: [1, 2, 3] };

  const newone1 = copy(original1);

  newone1.myArray.push(4);
  console.log(newone1);    // [1, 2, 3, 4]
  console.log(original1);  // [1, 2, 3, 4]  ops...

})();

// To solve this problem, we have to create a function that performs deep copy (that
// creates copy of nested objects as well). We can use quite similar approach but
// when we reach a property that is not a primitive value, instead of using assignement,
// we will recursively copy the object stored in that property.

(() => {

  const deepCopy = (source) => {
    // if source is a primitive value, then just assign it to result
    let result = source;

    // if source is an object
    if (typeof source === 'object') {
      // distinguish between object and array
      result = new source.constructor();

      // same as before but we call a deep copy recursively with each assignment
      Object.getOwnPropertyNames(source).forEach((prop) => {
        result[prop] = deepCopy(source[prop]);
      });
    }

    return result;
  };

  const original = { myArray: [1, 2, 3] };

  const newone = deepCopy(original);

  newone.myArray.push(4);
  console.log(newone);    // [1, 2, 3, 4]
  console.log(original);  // [1, 2, 3]

})();

// This way, we can create a deep copy of an object whenever we need it. But in
// case of simple objects, when shalow would be sufficient, we don't really
// have create our own copy function because JavaScript can handle it
// on its own. We can either use object desctructuring or Object.assign method.

(() => {

  const original = { version: 1, status: 'cool' };

  const newOne1 = { ...original };

  console.log(newOne1 === original);

  newOne1.version = 2;
  console.log(newOne1.version);    // 2
  console.log(original.version);   // 1

  const newOne2 = Object.assign({}, original);

  console.log(newOne2 === original);

  newOne2.version = 2;
  console.log(newOne2.version);    // 2
  console.log(original.version);   // 1

})();

// We will talk about Object.assign method in the next section.

// --------------------------------------------------------------------------
// MIXIN PATTERN - COMBINING MULTIPLE OBJECTS TOGETHER
//
