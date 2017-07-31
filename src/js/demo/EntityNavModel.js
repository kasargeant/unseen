/**
 * @file EntityNavModel.js
 * @description EntityNavView component.
 * @license See LICENSE file included in this distribution.
 */

"use strict";

// Imports
const Unseen = require("../../index");

class EntityNavModel extends Unseen.Model {
    initialize() {
        this.baseSchema = {"title": "No title", "items": {}};
    }
}


// Exports
module.exports = EntityNavModel;
