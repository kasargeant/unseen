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
const Unseen = require("../../src/index");

// Constants
let workingDirectory = process.cwd();
if(IS_TRAVIS) {workingDirectory = process.env.TRAVIS_BUILD_DIR;} // Usually: "/home/travis/build/kasargeant/warhorse"

// Setup
let rawData = require("../data/processed_sample.json");

// MODEL
class MyModel extends Unseen.Model {
    constructor(record, parent) {
        let definition = {"id": 0, "idn": "unnamed", "class": "unknown", "type": "unknown", "name": "Unnamed"};
        super(definition, record, parent);
    }
}
let myModelInstance = new MyModel({"id": 123, "idn": "015695954", "type": "test", "name": "Test Street"});

// MODEL COLLECTION
class MyModelCollection extends Unseen.ModelCollection {
    constructor(data) {
        super(MyModel, data);
    }
}
let myModelCollectionInstance = new MyModelCollection(rawData);

// VIEW
class MyView extends Unseen.View {

    initialize() {
        this.id = "my-item";
        this.tag = "div";
        this.classList = ["card"];
    }

    events() {
        return {
            "#button-delete": ["click", "deleteAction"]
        };
    }

    template(model, idx) {

        return `
            <div class="card-header">
                <h4 class="card-title">${model.id}</h4>
                <h6 class="card-subtitle">${model.name}</h6>
            </div>
            <div class="card-body">
                ${model.id}: ${model.type} - ${model.name}
            </div>
            <div class="card-footer">
                <button id="button-delete" class="btn btn-primary">Delete</button>
            </div>
        `;
    }

    deleteAction(evt) {
        console.log(`deleteAction for ${this._id} called by ${JSON.stringify(evt)}.`);
        this.destroy();
    }
}
let myViewInstance = new MyView(myModelInstance);


// VIEW COLLECTION
class MyViewCollection extends Unseen.ViewCollection {
    constructor(modelCollection, parent, id) {
        super(MyView, modelCollection, parent, id);

        this.id = "my-list";
        this.tag = "div";
        this.classList = ["container"];
    }
}
let myViewCollectionInstance = new MyViewCollection(myModelCollectionInstance);


console.log(`Testing with ${myModelCollectionInstance.length} records.`);

// let markupResult = {html: ""};
// // myViewCollectionInstance._render(true);
// myViewCollectionInstance._renderMarkup(false, markupResult);


// let markupResult = {html: ""};
// myViewInstance._renderMarkup(false, markupResult);
// console.log(markupResult);



// Tests
describe("Class: View", function() {

    describe("Standard sanity check", function() {
        it("contains spec with an positive expectation", function() {
            expect(true).toBe(true);
        });
        it("contains spec with a negative expectation", function() {
            expect(!true).toBe(false);
        });
    });

    describe("View", function() {

        it("should return render text output.", function() {
            let markupResult = {html: ""};
            myViewInstance._renderMarkup(false, markupResult);
            expect(markupResult.html).not.toBe("");
            expect(markupResult.html).toMatchSnapshot();
        });

    });
    describe("ViewCollection", function() {

        it("should return render text output.", function() {
            let markupResult = {html: ""};
            myViewCollectionInstance._renderMarkup(false, markupResult);
            expect(markupResult.html).not.toBe("");
            expect(markupResult.html).toMatchSnapshot();
        });

    });

    // describe("Collections", function() {
    //
    //     class TestModel extends Unseen.Model {
    //         constructor(record, parent, id) {
    //             let definition = {a: "hi", b: "ho", c: 3};
    //             super(definition, record, parent, id);
    //         }
    //     }
    //     class TestCollection extends Unseen.ModelCollection {
    //         constructor(data) {
    //             super(TestModel, data);
    //         }
    //     }
    //     let testCollectionInstance1 = new TestCollection();
    //     let testCollectionInstance2 = new TestCollection([
    //         {b: "o"},
    //         {a: "hiya", b: "hoho", c: 1},
    //         {a: "riii", b: "biii", c: 20}
    //     ]);
    //     let testModelInstance1 = testCollectionInstance2.get(0);
    //     let testModelInstance2 = testCollectionInstance2.get(1);
    //     let testModelInstance3 = testCollectionInstance2.get(2);
    //
    //
    //
    //     it("should be able to manufacture a Collection class for a given Model.", function() {
    //         expect(TestCollection).toBeDefined();
    //     });
    //
    //     it("should be able to make instances of the Collection without model data.", function() {
    //         expect(testCollectionInstance1).toBeDefined();
    //         expect(testCollectionInstance1.length).toBe(0);
    //     });
    //
    //     it("should be able to make instances of the Collection with initial model data.", function() {
    //         expect(testCollectionInstance2).toBeDefined();
    //         expect(testCollectionInstance2.length).toBe(3);
    //     });
    //     //
    //     it("should be able to make instances of the Model with all values.", function() {
    //         expect(testModelInstance3.a).toBe("riii");
    //         expect(testModelInstance3.b).toBe("biii");
    //         expect(testModelInstance3.c).toBe(20);
    //     });
    //
    //     it("should be able to make instances of the Model with binding contamination", function() {
    //         expect(testModelInstance2.a).toBe("hiya");
    //         expect(testModelInstance2.b).toBe("hoho");
    //         expect(testModelInstance2.c).toBe(1);
    //     });
    // });

});
