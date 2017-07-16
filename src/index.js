/**
 * @file index.js
 * @description Module index.
 * @license See LICENSE file included in this distribution.
 */

// Imports
const BaseModel = require("./js/unseen/BaseModel");
const BaseModelCollection = require("./js/unseen/BaseModelCollection");
const BaseView = require("./js/unseen/BaseView");
const BaseViewCollection = require("./js/unseen/BaseViewCollection");
const Model = require("./js/unseen/Model");
const ModelCollection = require("./js/unseen/ModelCollection");
const View = require("./js/unseen/View");
const ViewCollection = require("./js/unseen/ViewCollection");

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
