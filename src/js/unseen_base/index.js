/**
 * @file index.js
 * @description Module index.
 * @license See LICENSE file included in this distribution.
 */

"use strict";

// Imports
const BaseModel = require("../unseen/BaseModel");
const BaseModelCollection = require("../unseen/BaseModelCollection");
const BaseView = require("../unseen/BaseView");
const BaseViewCollection = require("../unseen/BaseViewCollection");

const jQuery = require("jquery");

let rawData = require("../../data/processed_sample.json");

// MODEL
class MyModel extends BaseModel {
    constructor(record, parent) {
        let definition = {"id": 0, "idn": "unnamed", "class": "unknown", "type": "unknown", "name": "Unnamed"};
        super(definition, record, parent);
    }
}

// MODEL COLLECTION
class MyModelCollection extends BaseModelCollection {
    constructor(data) {
        super(MyModel, data);
    }
}
let myModelCollection = new MyModelCollection(rawData);

// VIEW
class MyView extends BaseView {

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

// VIEW COLLECTION
class MyViewCollection extends BaseViewCollection {
    constructor(modelCollection, parent, id) {
        super(MyView, modelCollection, parent, id);

        this.id = "my-list";
        this.tag = "div";
        this.classList = ["container"];
    }
}
let myViewCollection = new MyViewCollection(myModelCollection);

// DEMO
console.log(`With ${myModelCollection.length} records.`);
console.time("render");

// myViewCollection._render(true);
myViewCollection._renderMarkup(true);

console.timeEnd("render");

console.time("insert");
jQuery(document).ready(function() {
    // Action after append is completely done
    console.timeEnd("insert");
});

