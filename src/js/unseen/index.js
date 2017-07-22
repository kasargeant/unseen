/**
 * @file index.js
 * @description Module index.
 * @license See LICENSE file included in this distribution.
 */

"use strict";

// Imports
const Unseen = require("../../index");

const jQuery = require("jquery");

let rawData = require("../../data/processed_sample.json");

// SCHEMA
const schema = {"id": 0, "idn": "unnamed", "class": "unknown", "type": "unknown", "name": "Unnamed"};

// MODEL
let myModel = new Unseen.Model({"id": 123, "idn": "015695954", "type": "test", "name": "Test Street"}, {
    schema: schema
});


// MODEL COLLECTION
let myModelCollection = new Unseen.ModelCollection(rawData, {
    schema: schema
});

// VIEW
class MyView extends Unseen.View {

    initialize() {
        this.baseModel = myModel;
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
let myViewInstance = new MyView(myModel);


// VIEW COLLECTION
class MyViewCollection extends Unseen.ViewCollection {
    initialize() {
        this.baseClass = MyView;
        this.id = "my-list";
        this.tag = "div";
        this.classList = ["container"];
    }
}
let myViewCollection = new MyViewCollection(myModelCollection);

// DEMO: CONSOLE
// let markupResult = {html: ""};
// myView._renderMarkup(false, markupResult);
// console.log(markupResult.html);
// let markupResult = {html: ""};
// myViewCollection._renderMarkup(false, markupResult);
// console.log(markupResult.html);

// DEMO: BROWSER
console.log(`Testing with ${myModelCollection.length} records.`);
console.time("render");

// myViewCollection._render(true);
myViewCollection._renderMarkup(true);

console.timeEnd("render");

console.time("insert");
jQuery(document).ready(function() {
    // Action after append is completely done
    console.timeEnd("insert");
});

