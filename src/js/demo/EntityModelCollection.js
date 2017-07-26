/**
 * @file EntityModelCollection.js
 * @description EntityModelCollection component.
 * @license See LICENSE file included in this distribution.
 */

"use strict";

// Imports
const Unseen = require("../../index");

const EntityModel = require("./EntityModel");

// MODEL COLLECTION
class EntityModelCollection extends Unseen.ModelCollection {
    initialize() {
        this.baseClass = EntityModel;
    }
}

// Exports
module.exports = EntityModelCollection;
