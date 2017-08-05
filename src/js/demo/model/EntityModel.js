/**
 * @file EntityModel.js
 * @description EntityModel component.
 * @license See LICENSE file included in this distribution.
 */

"use strict";

// Imports
const Unseen = require("../../../index");

// MODEL
class EntityModel extends Unseen.Model {
    initialize() {
        this.baseSchema = {"id": 0, "idn": "unnamed", "class": "unknown", "type": "unknown", "name": "Unnamed"};
    }
}

// Exports
module.exports = EntityModel;
