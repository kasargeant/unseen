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

// const schema = {"id": 0, "idn": "unnamed", "class": "unknown", "type": "unknown", "name": "Unnamed"};

// MODEL
let myModelInstance = new Unseen.Model({"id": 123, "idn": "015695954", "type": "test", "name": "Test Street"});

// MODEL COLLECTION
let myModelCollection = new Unseen.ModelCollection(rawData);

// VIEW
class MyView extends Unseen.View {

    initialize() {
        this.baseModel = myModelInstance;
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
    initialize() {
        this.baseClass = MyView;
        this.id = "my-list";
        this.tag = "div";
        this.classList = ["container"];
    }
}
let myViewCollectionInstance = new MyViewCollection(myModelCollection);
myViewCollectionInstance.fetch(false);


console.log(`Testing with ${myModelCollection.length} records.`);

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

});
