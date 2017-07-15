/**
 * @file UnseenBase.test.js
 * @description Unit tests for the Unseen base class library.
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

        class TestModel extends Unseen.BaseModel {
            constructor(record, parent, id) {
                let definition = {a: "hi", b: "ho", c: 3};
                super(definition, record, parent, id);
            }
        }
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

    describe("Collections", function() {

        class TestModel extends Unseen.BaseModel {
            constructor(record, parent, id) {
                let definition = {a: "hi", b: "ho", c: 3};
                super(definition, record, parent, id);
            }
        }
        class TestCollection extends Unseen.BaseModelCollection {
            constructor(data) {
                super(TestModel, data);
            }
        }
        let testCollectionInstance1 = new TestCollection();
        let testCollectionInstance2 = new TestCollection([
            {b: "o"},
            {a: "hiya", b: "hoho", c: 1},
            {a: "riii", b: "biii", c: 20}
        ]);
        let testModelInstance1 = testCollectionInstance2.get(0);
        let testModelInstance2 = testCollectionInstance2.get(1);
        let testModelInstance3 = testCollectionInstance2.get(2);



        it("should be able to manufacture a Collection class for a given Model.", function() {
            expect(TestCollection).toBeDefined();
        });

        it("should be able to make instances of the Collection without model data.", function() {
            expect(testCollectionInstance1).toBeDefined();
            expect(testCollectionInstance1.length).toBe(0);
        });

        it("should be able to make instances of the Collection with initial model data.", function() {
            expect(testCollectionInstance2).toBeDefined();
            expect(testCollectionInstance2.length).toBe(3);
        });
        //
        it("should be able to make instances of the Model with all values.", function() {
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

