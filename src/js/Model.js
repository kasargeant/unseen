/**
 * @file Model.js
 * @description The Model class.
 * @author Kyle Alexis Sargeant <kasargeant@gmail.com> {@link https://github.com/kasargeant https://github.com/kasargeant}.
 * @copyright Kyle Alexis Sargeant 2017
 * @license See LICENSE file included in this distribution.
 */

"use strict";

const Model = function(definition, record, parent) {
    this._parent = parent;
    this._defaults = definition;
    this._keys = Object.keys(definition);
    this._record = {};

    for(let key of this._keys) {

        Object.defineProperty(this, key, {
            get: function() { return this._record[key]; },
            set: function(value) { this._record[key] = value; }
        });

        this._record[key] = record[key] || this._defaults[key];
    }
};

Model.prototype._dump = function() {
    return JSON.stringify(this._record);
};

// Exports
module.exports = Model;

//
// class MyModel extends Model {
//     constructor(record, parent) {
//         let definition = {
//             a: "hi",
//             b: "ho",
//             c: 3
//         };
//         super(definition, record, parent);
//     }
// }
//
// let myModel = new MyModel({
//     a: "ha",
//     b: "he"
// });
// let myModelB = new MyModel({
//     a: "hing",
//     b: "hong",
//     c: 2
// });
// console.log(myModel.c);
// console.log(myModelB.c);
// console.log(myModel.a);
// console.log(myModelB.a);
