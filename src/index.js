/**
 * @file index.js
 * @description Module index.
 * @license See LICENSE file included in this distribution.
 */

// Imports
const Model = require("./js/unseen/Model");
const ModelCollection = require("./js/unseen/ModelCollection");
const View = require("./js/unseen/View");
const ViewCollection = require("./js/unseen/ViewCollection");

// Exports
module.exports = {
    Model: Model,
    ModelCollection: ModelCollection,
    View: View,
    ViewCollection: ViewCollection
};
