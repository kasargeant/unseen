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

// TEMPLATE
const template = function(model, idx) {

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
};

// VIEW
let myView = new Unseen.View(myModel, {
    id: "view",
    target: "main",
    tag: "div",
    classList: ["card"],
    template: template,
    methods: {
        deleteAction(evt) {
            console.log(`deleteAction for ${this._id} called by ${JSON.stringify(evt)}.`);
            this.destroy();
        }
    },
    events: {
        "#button-delete": ["click", "deleteAction"]
    }
});

// VIEW COLLECTION
let myViewCollection = new Unseen.ViewCollection(myModelCollection, {
    id: "my-list",
    target: "main",
    tag: "div",
    classList: ["container"],
    view: {
        id: "my-item",
        target: "main",
        tag: "div",
        classList: ["card"],
        template: template,
        methods: {
            deleteAction(evt) {
                console.log(`deleteAction for ${this._id} called by ${JSON.stringify(evt)}.`);
                this.destroy();
            }
        },
        events: {
            "#button-delete": ["click", "deleteAction"]
        }
    }
});

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

