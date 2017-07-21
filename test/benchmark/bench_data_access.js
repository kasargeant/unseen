"use strict";

const Benchmark = require("benchmark");
let suite = new Benchmark.Suite("Appending/slicing a string that's embedded in object vs array");

let benchObj = {a: 10, b: "hi there", c: true};
let benchArr = [10, "hi there", true];
let FnObj = function(data) {
    this._data = data;
    this._keys = Object.keys(data);
    for(let key of this._keys) {
        // Define property
        Object.defineProperty(this, key, {
            get: function() {
                return this._data[key];
            },
            set: function(value) {
                // Assign new value - or default value if none given.
                this._data[key] = value;
            }
        });
        // Then assign the property a value - or default value if none given.
        this._data[key] = data[key];
    }
};
let benchFnObj = new FnObj({a: 10, b: "hi there", c: true});

let FnObj2 = function(data) {
    this._data = data;
};
FnObj2.prototype.a = function() {
    return this._data.a;
};
FnObj2.prototype.b = function() {
    return this._data.b;
};
FnObj2.prototype.c = function() {
    return this._data.c;
};
let benchFnObj2 = new FnObj2({a: 10, b: "hi there", c: true});

let FnObj3 = function(data) {
    this.data = data;
    this.keys = Object.keys(data);
};
let benchFnObj3 = new FnObj3({a: 10, b: "hi there", c: true});

// Sanity check
// console.log(benchObj.a);
// console.log(benchObj.b);
// console.log(benchObj.c);
// console.log(benchArr[0]);
// console.log(benchArr[1]);
// console.log(benchArr[2]);
// console.log(benchFnObj.a);
// console.log(benchFnObj.b);
// console.log(benchFnObj.c);
// console.log(benchFnObj2.a());
// console.log(benchFnObj2.b());
// console.log(benchFnObj2.c());



// Benchmark
suite
    .add("simple object", function() {
        return benchObj.b;
    })
    .add("simple array", function() {
        return benchArr[1];
    })
    .add("function object (getters/setters)", function() {
        return benchFnObj.b;
    })
    .add("function object2 (std get methods)", function() {
        return benchFnObj2.b;
    })
    .add("function object3 (direct properties)", function() {
        return benchFnObj3.data.b;
    })
    // add listeners
    .on("cycle", function(event) {
        console.log(String(event.target));
    })
    .on("complete", function() {
        console.log("Fastest is " + this.filter("fastest").map("name"));
    })
    // run async
    .run({"async": true});
