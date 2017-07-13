/**
 * @file index.js
 * @description Module index.
 * @license See LICENSE file included in this distribution.
 */

// Imports
const Model = require("./js/unseen/Model");
const Collection = require("./js/unseen/ModelCollection");
const View = require("./js/unseen/View");

// Exports
module.exports = {
    Collection: Collection,
    Model: Model,
    View: View
};
