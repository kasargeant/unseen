/**
 * @file EntityModelList.js
 * @description EntityModelList component.
 * @license See LICENSE file included in this distribution.
 */

"use strict";

// Imports
const Unseen = require("../../../index");

const EntityModel = require("./EntityModel");

// MODEL COLLECTION
class EntityModelList extends Unseen.ModelList {
    initialize() {
        this.baseClass = EntityModel;
    }
}

// Exports
module.exports = EntityModelList;
