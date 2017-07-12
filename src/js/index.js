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

class MyCollection extends Collection {
    constructor(data) {
        super(MyModel, data);
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

let myCollection = new MyCollection([
    {a: "hoobie", b: "homie", c: 3},
    {a: "froobie", b: "stubie", c: 2},
    {a: "moobie", b: "mobie", c: 4}
]);

class MyView extends View {

    template(model, idx) {
        return `<div id="idx-${idx}">${model.a}: ${model.b} - ${model.c}</div>`;
    }
}

let myView = new MyView(myCollection);

console.log("CLASS: " + MyView.name);

// myView.renderFragment();
// console.log(myView.render());
jQuery("main").append(myView.render());
// jQuery("main").append(myView.renderFragment());

// Exports
// module.exports = Unseen;
