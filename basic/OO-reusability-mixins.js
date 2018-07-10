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
// It the previous section, we have looked on how we can make a copy of some
// object. But what if we wanted to combine multiple object together to produce
// one that will have properties of all the objects that were used to create
// it? Here comes mixin pattern. The idea is pretty simple, just copy each property
// of each source object one by one to the new object.

// JavaScript already provides us with such utility and we have already seen it,
// Object.assign(), which we have used in the previous section to make a copy of
// a single object, but this method can take more than just one source object,
// and the first argument, target object, doesn't need to be empty. If we pass
// multiple source objects, then each of them will be mixed into the target, one
// by one, and if there are any property collisions (two of those object have a
// property with the same name) then the later one wins, overwriting the previous
// one.

// Let's look on a simple example of Object.assign.

(() => {

  const identity = { name: 'Sue', username: 'Sue123' };
  const address = { state: 'Alaska', city: 'Noma' };
  const anotherAddress = { state: 'Sweden', city: 'Malmo' };
  const hobbies = { sports: ['skying', 'swimming'] };

  const sue = Object.assign({}, identity, address, anotherAddress, hobbies);

  console.log(sue);

  sue.sports.push('tennis');

  console.log(sue.sports);
  console.log(hobbies.sports);

})();

// We can see that "sue" now has all properties of passed in objects, but
// properties of "address" were overwriten by "anotherAddress" because
// "anotherAddress" is passed to Object.assign after "address"

// This approach is usually enough but suffers from the same problem as our
// first "copy" function in the previous section, it produces only a shallow copy
// so if make some in-place changes to object properties, e.g. we add new
// a new sport to hobbies.sports using "push" method, then not only "sue" will
// change, but the original "hobbies" object will change as well.

// Let's try to use some knowledge from previous section and create a similar
// deep mixin function.

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

  function mixin(...sources) {
    const result = {};

    sources.forEach((source) => {
      const sourceCopy = deepCopy(source);

      Object.getOwnPropertyNames(sourceCopy).forEach((prop) => {
        result[prop] = sourceCopy[prop];
      });
    });

    return result;
  }

  const identity = { name: 'Sue', username: 'Sue123' };
  const address = { state: 'Alaska', city: 'Noma' };
  const anotherAddress = { state: 'Sweden', city: 'Malmo' };
  const hobbies = { sports: ['skying', 'swimming'] };

  const sue = mixin(identity, address, anotherAddress, hobbies);

  console.log(sue);

  sue.sports.push('tennis');

  console.log(sue.sports);
  console.log(hobbies.sports);

})();

// If we now add some additional value to sue.sports, the original "hobbies"
// object stays unmodified.
