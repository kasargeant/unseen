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

class MyView extends View {

    initialize() {
        this.tag = "article";
    }

    template(model, idx) {
        return `<div id="somediv">${model.id}: ${model.type} - ${model.name}</div>
                <button id="button-delete"></button>`;
    }

    events() {
        return {
            "#button-delete": ["click", "deleteAction"]
        };
    }

    deleteAction(evt) {
        console.log(`deleteAction for ${this._id} called by ${evt.data.name}.`);
    }
}

class MyViewCollection extends ViewCollection {
    constructor(modelCollection, parent, id) {
        super(MyView, modelCollection, parent, id);
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
myViewCollection.renderFragment(true);

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
