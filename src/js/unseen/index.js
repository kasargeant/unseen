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


class MyModel extends Model {
    constructor(record, parent) {
        let definition = {"id": 0, "idn": "unnamed", "class": "unknown", "type": "unknown", "name": "Unnamed"};
        super(definition, record, parent);
    }
}

class MyModelCollection extends ModelCollection {
    constructor(data) {
        super(MyModel, data);
    }
}

let myModelCollection = new MyModelCollection(rawData);

// PURE VERSION
// class MyView extends View {
//
//     initialize() {
//         this.id = "my-item";
//         this.tag = "li";
//         this.classList = ["pure-menu-item"];
//     }
//
//     events() {
//         return {
//             "#button-delete": ["click", "deleteAction"]
//         };
//     }
//
//     template(model, idx) {
//         return `<div id="somediv">${model.id}: ${model.type} - ${model.name}</div>
//                 <button id="button-delete" class="pure-button">Delete</button>`;
//     }
//
//     deleteAction(evt) {
//         console.log(`deleteAction for ${this._id} called by ${JSON.stringify(evt)}.`);
//         this.destroy();
//     }
// }
//
// class MyViewCollection extends ViewCollection {
//     constructor(modelCollection, parent, id) {
//         super(MyView, modelCollection, parent, id);
//     }
//
//     initialize() {
//         this.id = "my-list";
//         this.tag = "ul";
//         this.classList = ["pure-menu-list"];
//     }
// }


class MyView extends View {

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

class MyViewCollection extends ViewCollection {
    constructor(modelCollection, parent, id) {
        super(MyView, modelCollection, parent, id);
    }

    initialize() {
        this.id = "my-list";
        this.tag = "div";
        this.classList = ["container"];
    }
}

let myViewCollection = new MyViewCollection(myModelCollection);

// console.log("CLASS: " + MyView.name);
console.log(`With ${myModelCollection.length} records.`);

// myView.renderFragment();
// console.log(myView.render());
console.time("render");

// With 99161 records.
// render: 255.842041015625ms
// insert: 21221.27880859375ms
// myViewCollection.render(true);

// With 99161 records.
// render: 1147.885009765625ms
// insert: 21828.57470703125ms
myViewCollection._render(true);

// With 99161 records.
// render: 427.306884765625ms
// insert: 20403.213134765625ms
// myView.renderTree(true);

console.timeEnd("render");
console.time("insert");
// jQuery("main").append(result);
jQuery(document).ready(function() {
    // Action after append is completely done
    console.timeEnd("insert");
});

// Exports
// module.exports = Unseen;
