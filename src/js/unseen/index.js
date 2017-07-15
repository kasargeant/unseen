/**
 * @file index.js
 * @description Module index.
 * @license See LICENSE file included in this distribution.
 */

"use strict";

// Imports
const Model = require("./Model");
const ModelCollection = require("./ModelCollection");
const View = require("./View");
const ViewCollection = require("./ViewCollection");

const jQuery = require("jquery");

let rawData = require("../../data/processed_sample.json");

// MODEL
class MyModel extends Model {
    initialize() {
        this.schema = {"id": 0, "idn": "unnamed", "class": "unknown", "type": "unknown", "name": "Unnamed"};
    }
}

// MODEL COLLECTION
class MyModelCollection extends ModelCollection {
    initialize() {
        this.ModelClass = MyModel;
    }
}

// VIEW
class MyView extends View {

    initialize() {
        this.model = null;
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
class MyViewCollection extends ViewCollection {
    initialize() {
        this.ViewClass = MyView;
        this.id = "my-list";
        this.tag = "div";
        this.classList = ["container"];
    }
}

// DEMO

let myModelCollection = new MyModelCollection(rawData);
let myViewCollection = new MyViewCollection(myModelCollection);

console.log(`With ${myModelCollection.length} records.`);
console.time("render");

myViewCollection._render(true);

console.timeEnd("render");

console.time("insert");
jQuery(document).ready(function() {
    // Action after append is completely done
    console.timeEnd("insert");
});

