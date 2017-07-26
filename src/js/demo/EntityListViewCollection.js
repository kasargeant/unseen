/**
 * @file EntityListViewCollection.js
 * @description EntityListViewCollection component.
 * @license See LICENSE file included in this distribution.
 */

"use strict";

// Imports
const Unseen = require("../../index");

const EntityListItemView = require("./EntityListItemView");

// MODEL
class EntityListViewCollection extends Unseen.ViewCollection {
    initialize() {
        this.baseClass = EntityListItemView;
        this.target = "body";
        this.tag = "main";
        this.id = "my-list";
        this.classList = ["container"];
    }
}

// Exports
module.exports = EntityListViewCollection;
