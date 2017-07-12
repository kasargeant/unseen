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



class MyModel extends Model {
    constructor(record, parent) {
        let definition = {a: "hi", b: "ho", c: 3};
        super(definition, record, parent);
    }
}

let myModel = new MyModel({
    a: "ha",
    b: "he"
});

let myModelB = new MyModel({
    a: "hing",
    b: "hong",
    c: 2
});

class MyView extends View {

    template(model) {
        return `<div id="${model.a}">${model.b} - ${model.c}</div>`;
    }
}

let myView = new MyView(myModel);
myView.render();
console.log(myView.el);
// jQuery("main").append(myView.el);

// Exports
// module.exports = Unseen;
