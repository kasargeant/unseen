/**
 * @file Unseen.test.js
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
const TestSchema = {id: 0, a: "hi", b: "ho", c: 3};

class TestModel extends Unseen.Model {
    initialize() {
        this.baseSchema = TestSchema;
        // this.indexBy = "id";
    }
}
class TestCollection extends Unseen.ModelList {
    initialize() {
        this.baseClass = TestModel;
    }
}

// Tests
describe("Class: ModelList", function() {

    describe("Standard sanity check", function() {
        it("contains spec with an positive expectation", function() {
            expect(true).toBe(true);
        });
        it("contains spec with a negative expectation", function() {
            expect(!true).toBe(false);
        });
    });


    describe("Class specific", function() {

        it("should be able to manufacture a Collection class for a given Model.", function() {
            expect(TestCollection).toBeDefined();
        });

    });

    describe("Instance defaults", function() {

        let testModelList;

        beforeEach(function() {
            testModelList = new TestCollection();
        });

        it("should be able to make instances of the Collection without model data.", function() {
            expect(testModelList).toBeDefined();
            expect(testModelList.length).toBe(0);
        });

        it("should return undefined for non-existant models.", function() {
            expect(testModelList.get(0)).not.toBeDefined();
            expect(testModelList.get(1)).not.toBeDefined();
        });

        it("should be able to be reset for a new model type.", function() {

            testModelList.reset([
                {id: 0, b: "o"},
                {id: 1, a: "hiya", b: "hoho", c: 1},
                {id: 2, a: "riii", b: "biii", c: 20}
            ]);

            let testModel = testModelList.get(1);

            expect(testModelList.length).toBe(3);
            expect(testModel.a).toBe("hiya");
            expect(testModel.b).toBe("hoho");
            expect(testModel.c).toBe(1);
        });

        it("should be add new model instances.", function() {
            let key = testModelList.add("test-model", {a: "hiya", b: "hoho", c: 1});
            expect(key).toBe("test-model");
            expect(testModelList.length).toBe(1);
            expect(testModelList.get(key).b).toBe("hoho");
        });

        it("should be able to remove model instances", function() {
            let key = testModelList.add("test-model", {a: "hiya", b: "hoho", c: 1});
            expect(testModelList.length).toBe(1);
            testModelList.remove(key);
            expect(testModelList.length).toBe(0);
            expect(testModelList.get(key)).not.toBeDefined();
        });
    });

    describe("Populating", function() {

        let testModelList = new TestCollection([
            {id: 0, b: "o"},
            {id: 1, a: "hiya", b: "hoho", c: 1},
            {id: 2, a: "riii", b: "biii", c: 20}
        ]);
        let testModel1 = testModelList.get(0);
        let testModel2 = testModelList.get(1);
        let testModel3 = testModelList.get(2);

        it("should be able to make instances of the Collection with initial model data.", function() {
            expect(testModelList).toBeDefined();
            expect(testModelList.length).toBe(3);
        });

        it("should be able to make instances of the Model with the Model's defaults", function() {
            expect(testModel1.a).toBe("hi");
            expect(testModel1.b).toBe("o");
            expect(testModel1.c).toBe(3);
        });

        it("should be able to make instances of the Model with binding contamination", function() {
            expect(testModel2.a).toBe("hiya");
            expect(testModel2.b).toBe("hoho");
            expect(testModel2.c).toBe(1);
        });

        it("should be able to make instances of the Model with all values.", function() {
            expect(testModel3.a).toBe("riii");
            expect(testModel3.b).toBe("biii");
            expect(testModel3.c).toBe(20);
        });

    });

});
