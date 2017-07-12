/**
 * @file index.js
 * @description Module index.
 * @license See LICENSE file included in this distribution.
 */

// Imports
const Model = require("./Model");
const Collection = require("./Collection");
const View = require("./View");
const jQuery = require("jquery");
let rawData = require("../../data/processed_half.json");


class MyModel extends Model {
    constructor(record, parent) {
        let definition = {"id":0,"idn":"unnamed","class":"unknown","type":"unknown","name":"Unnamed"};
        super(definition, record, parent);
    }
}

class MyCollection extends Collection {
    constructor(data) {
        super(MyModel, data);
    }
}

let myCollection = new MyCollection(rawData);

class MyView extends View {
    template(model, idx) {
        return `<div id="idx-${idx}">${model.id}: ${model.type} - ${model.name}</div>`;
    }
    // template(model, idx) {
    //     let el = document.createElement("div");
    //     el.id = `idx-${idx}`;
    //     let content = document.createTextNode(`${model.id}: ${model.type} - ${model.name}`); 
    //     el.appendChild(content); //add the text node to the newly created div. 
    //     return el;
    // }
}

let myView = new MyView(myCollection);

// console.log("CLASS: " + MyView.name);
console.log(`With ${myCollection.length} records.`);

// myView.renderFragment();
// console.log(myView.render());
console.time("render");

// With 99161 records.
// render: 255.842041015625ms
// insert: 21221.27880859375ms
let result = myView.render();

// With 99161 records.
// render: 1147.885009765625ms
// insert: 21828.57470703125ms
// let result = myView.renderFragment();

// With 99161 records.
// render: 427.306884765625ms
// insert: 20403.213134765625ms
// let result = myView.renderTree();

console.timeEnd("render");

console.time("insert");
jQuery("main").append(result);
jQuery(document).ready(function () {
    // Action after append is completly done
    console.timeEnd("insert");
});

// Exports
// module.exports = Unseen;
