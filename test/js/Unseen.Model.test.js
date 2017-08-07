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
const Unseen = require("../../src/js/unseen/Unseen");

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

        let testModel1 = new TestModel({b: "o"});
        let testModel2 = new TestModel({a: "hiya", b: "hoho", c: 1});  // We create second instance for binding contamination checks
        let testModel3 = new TestModel({a: "riii", b: "biii", c: 20});

        it("should be able to manufacture a Model class for a given definition", function() {
            expect(TestModel).toBeDefined();
        });

        it("should be able to make instances of the Model using correct defaults", function() {
            expect(testModel1.a).toBe("hi");
            expect(testModel1.b).toBe("o");
            expect(testModel1.c).toBe(3);
        });

        it("should be able to make instances of the Model with all values", function() {
            expect(testModel3.a).toBe("riii");
            expect(testModel3.b).toBe("biii");
            expect(testModel3.c).toBe(20);
        });

        it("should be able to make instances of the Model with binding contamination", function() {
            expect(testModel2.a).toBe("hiya");
            expect(testModel2.b).toBe("hoho");
            expect(testModel2.c).toBe(1);
        });
    });


});
