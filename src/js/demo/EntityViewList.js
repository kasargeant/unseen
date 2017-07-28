/**
 * @file EntityListViewList.js
 * @description EntityListViewList component.
 * @license See LICENSE file included in this distribution.
 */

"use strict";

// Imports
const Unseen = require("../../index");

const EntityListItemView = require("./EntityListItemView");

// MODEL
class EntityListViewList extends Unseen.ViewList {
    initialize() {
        this.baseClass = EntityListItemView;
        this.target = "body";
        this.tag = "main";
        this.id = "my-list";
        this.classList = ["container"];
    }
}

// Exports
module.exports = EntityListViewList;
