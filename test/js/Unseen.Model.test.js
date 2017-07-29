/**
 * @file Unseen.Model.test.js
 * @description Unit tests for the Unseen ES2015 class library.
 * @author Kyle Alexis Sargeant <kasargeant@gmail.com> {@link https://github.com/kasargeant https://github.com/kasargeant}.
 * @copyright Kyle Alexis Sargeant 2017
 * @license See LICENSE file included in this distribution.
 */

"use strict";

// Environment
const IS_CI = process.env.CI;
const IS_TRAVIS = process.env.TRAVIS;

// Imports
const fs = require("fs");
const path = require("path");
// const sinon = require("sinon");

// Unit
const Unseen = require("../../src/index");

// Constants
let workingDirectory = process.cwd();
if(IS_TRAVIS) {workingDirectory = process.env.TRAVIS_BUILD_DIR;} // Usually: "/home/travis/build/kasargeant/warhorse"

// Setup
const TestSchema = {a: "hi", b: "ho", c: 3};

class TestModel extends Unseen.Model {
    initialize() {
        this.baseSchema = TestSchema;
    }
}

// Tests
describe("Class: Unseen", function() {

    describe("Standard sanity check", function() {
        it("contains spec with an positive expectation", function() {
            expect(true).toBe(true);
        });
        it("contains spec with a negative expectation", function() {
            expect(!true).toBe(false);
        });
    });

    describe("Models", function() {


        let testModelInstance1 = new TestModel({b: "o"});
        let testModelInstance2 = new TestModel({a: "hiya", b: "hoho", c: 1});  // We create second instance for binding contamination checks
        let testModelInstance3 = new TestModel({a: "riii", b: "biii", c: 20});

        it("should be able to manufacture a Model class for a given definition", function() {
            expect(TestModel).toBeDefined();
        });

        it("should be able to make instances of the Model using correct defaults", function() {
            expect(testModelInstance1.a).toBe("hi");
            expect(testModelInstance1.b).toBe("o");
            expect(testModelInstance1.c).toBe(3);
        });

        it("should be able to make instances of the Model with all values", function() {
            expect(testModelInstance3.a).toBe("riii");
            expect(testModelInstance3.b).toBe("biii");
            expect(testModelInstance3.c).toBe(20);
        });

        it("should be able to make instances of the Model with binding contamination", function() {
            expect(testModelInstance2.a).toBe("hiya");
            expect(testModelInstance2.b).toBe("hoho");
            expect(testModelInstance2.c).toBe(1);
        });
    });


});

//
//
// let MyModel = Unseen.makeModel({
//     a: "hi",
//     b: "ho",
//     c: 3
// });
//
// let myModel = new MyModel({
//     a: "ha",
//     b: "he"
// });
// let myModelB = new MyModel({
//     a: "hing",
//     b: "hong",
//     c: 2
// });
// console.log(myModel.c);
// console.log(myModelB.c);
// console.log(myModel.a);
// console.log(myModelB.a);
//
//
// // let myCollection = new Collection(MyModel);
//
// const Collection = Unseen.makeCollection(MyModel);
// let myCollection = new Collection();
//
// myCollection.add({a: "hoobie", b: "homie", c: 3});
// myCollection.add({a: "froobie", b: "stubie", c: 2});
// myCollection.add({a: "moobie", b: "mobie", c: 4});
// let model = myCollection.get(1);
// console.log(model.a);
// myCollection._dump();
//
// // alt collection
// const AnotherCollection = Unseen.makeCollection(Unseen.makeModel({
//     x: "hi",
//     y: "ho"
// }));
// let anotherCollection = new AnotherCollection([
//     {x: 10, y: 20},
//     {x: 11, y: 20},
//     {x: 14, y: 19}
// ]);
// let modelAnother = anotherCollection.get(1);
// console.log(modelAnother.x);
// anotherCollection._dump();
//
//
// let myCollection2 = new Collection();
// myCollection2.add({a: "hoobie2", b: "homie2", c: 31});
// myCollection2.add({a: "froobie2", b: "stubie2", c: 21});
// myCollection2.add({a: "moobie2", b: "mobie2", c: 41});
// let model2 = myCollection2.get(1);
// console.log(model2.a);
// myCollection2._dump();

