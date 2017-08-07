/**
 * @file EntityListViewList.js
 * @description EntityListViewList component.
 * @license See LICENSE file included in this distribution.
 */

"use strict";

// Imports
const Unseen = require("../../unseen/Unseen");

const EntityViewListItem = require("./EntityViewListItem");

// MODEL
class EntityViewList extends Unseen.ViewList {
    initialize() {
        this.baseClass = EntityViewListItem;
        this.target = "main";
        this.tag = "section";
        this.id = "my-list";
        this.classList = ["container"];
    }

    style() {
        return `
        <style>
            :host {
                display: inline-block;
                width: 100%;
                contain: content;
            }
        </style>
        `;
    }
}

// Exports
module.exports = EntityViewList;
