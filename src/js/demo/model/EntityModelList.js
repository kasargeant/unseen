/**
 * @file EntityModelList.js
 * @description EntityModelList component.
 * @license See LICENSE file included in this distribution.
 */

"use strict";

// Imports
const Unseen = require("../../unseen/Unseen");

const EntityModel = require("./EntityModel");

// MODEL COLLECTION
class EntityModelList extends Unseen.ModelList {
    initialize() {
        this.baseClass = EntityModel;
    }
}

// Exports
module.exports = EntityModelList;
