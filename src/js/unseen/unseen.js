/**
 * @file index.js
 * @description Module index.
 * @license See LICENSE file included in this distribution.
 */

// Imports
const BaseModel = require("./BaseModel");
const BaseModelCollection = require("./BaseModelCollection");
const BaseView = require("./BaseView");
const BaseViewCollection = require("./BaseViewCollection");
const Model = require("./Model");
const ModelCollection = require("./ModelCollection");
const View = require("./View");
const ViewCollection = require("./ViewCollection");

// Exports
module.exports = {
    BaseModel: BaseModel,
    BaseModelCollection: BaseModelCollection,
    BaseView: BaseView,
    BaseViewCollection: BaseViewCollection,
    Model: Model,
    ModelCollection: ModelCollection,
    View: View,
    ViewCollection: ViewCollection
};
