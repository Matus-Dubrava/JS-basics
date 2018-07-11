
function CarMaker() {}
CarMaker.prototype.drive = function() { console.log(`driving, have ${this.doors} doors`); };

CarMaker.factory = function(type) {

  if (typeof CarMaker[type] !== 'function') {
    throw new Error(`${type} doesn't exist`);
  }

  if (typeof CarMaker[type].prototype.drive !== 'function') {
    CarMaker[type].prototype = new CarMaker();
  }

  const car = new CarMaker[type]();
  return car;
};

CarMaker.SUV = function() {
  this.doors = 10;
};

CarMaker.Convertible = function() {
  this.doors = 2;
};

CarMaker.Compact = function() {
  this.doors = 4;
};

const corolla = CarMaker.factory('Compact');
const solstice = CarMaker.factory('Convertible');
const cherokee = CarMaker.factory('SUV');

corolla.drive();
solstice.drive();
cherokee.drive();
