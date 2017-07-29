/**
 * @file index.js
 * @description Module index.
 * @license See LICENSE file included in this distribution.
 */

"use strict";

// Imports
const Unseen = require("../../index");

const jQuery = require("jquery");

// let rawData = require("../../data/processed_sample.json");
let rawData = [];

// SCHEMA
const schema = {"id": 0, "idn": "unnamed", "class": "unknown", "type": "unknown", "name": "Unnamed"};

// MODEL
class MyModel extends Unseen.Model {
    initialize() {
        this.baseSchema = schema;
        // this.url = "http://localhost:8080/entity/1";
    }
}
let myModel = new MyModel({"id": 123, "idn": "015695954", "type": "test", "name": "Test Street"});


// MODEL COLLECTION
class MyModelList extends Unseen.ModelList {
    initialize() {
        this.baseClass = MyModel;
        this.url = "http://localhost:8080/entity";
    }
}
let myModelList = new MyModelList();

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
let myView = new MyView(myModel);


// VIEW COLLECTION
class MyViewList extends Unseen.ViewList {
    initialize() {
        this.baseClass = MyView;
        this.id = "my-list";
        this.tag = "div";
        this.classList = ["container"];
    }
}
let myViewList = new MyViewList(myModelList);

// DEMO: CONSOLE
// let markupResult = {html: ""};
// myView._renderMarkup(false, markupResult);
// console.log(markupResult.html);
// let markupResult = {html: ""};
// myViewList._renderMarkup(false, markupResult);
// console.log(markupResult.html);

// DEMO: BROWSER
console.log(`Testing with ${myModelList.length} records.`);
console.time("render");

// myViewList._render(true);
// myViewList._renderMarkup(true);

console.timeEnd("render");

console.time("insert");
jQuery(document).ready(function() {
    // Action after append is completely done
    console.timeEnd("insert");
});

