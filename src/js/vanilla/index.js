/**
 * @file index.js
 * @description Module index.
 * @license See LICENSE file included in this distribution.
 */

"use strict";

// Imports
const Unseen = require("../../index");


const jQuery = require("jquery");

let rawData = require("../../data/processed_half.json");

// SCHEMA
const schema = {"id": 0, "idn": "unnamed", "class": "unknown", "type": "unknown", "name": "Unnamed"};

// MODEL
class MyModel extends Unseen.Model {
    initialize() {
        this.baseSchema = schema;
    }
}
let myModelInstance = new MyModel({"id": 123, "idn": "015695954", "type": "test", "name": "Test Street"});


// MODEL COLLECTION
class MyModelCollection extends Unseen.ModelCollection {
    initialize() {
        this.baseClass = MyModel;
    }
}
let myModelCollectionInstance = new MyModelCollection(rawData);

// VIEW
class MyView extends Unseen.View {

    initialize() {
        this.baseModel = myModelInstance;
        this.tag = "li";
    }

    template(model, idx) {
        return `${model.id}: ${model.type} - ${model.name}`;
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
        this.tag = "ul";
        this.classList = [];
    }
}

// DEMO

let myModelCollection = new MyModelCollection(rawData);
let myViewCollectionInstance = new MyViewCollection(myModelCollection);

// DEMO: CONSOLE
// let markupResult = {html: ""};
// myView._renderMarkup(false, markupResult);
// console.log(markupResult.html);
// let markupResult = {html: ""};
// myViewCollectionInstance._renderMarkup(false, markupResult);
// console.log(markupResult.html);

// DEMO: BROWSER
console.log(`Testing with ${myModelCollection.length} records.`);
console.time("render");

// myViewCollectionInstance._render(true);
myViewCollectionInstance._renderMarkup(true);

console.timeEnd("render");

console.time("insert");
jQuery(document).ready(function() {
    // Action after append is completely done
    console.timeEnd("insert");
});

