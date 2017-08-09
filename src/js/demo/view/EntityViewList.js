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

    /**
     * Initialize and target component
     */
    initialize() {
        this.baseClass = EntityViewListItem;
        this.target = "main";
        this.tag = "section";
        this.id = "my-list";
        this.classList = ["container"];
    }

    /**
     * Defines 'scoped' stylesheet
     * @returns {string}
     */
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
