/**
 * @file EntityListViewList.js
 * @description EntityListViewList component.
 * @license See LICENSE file included in this distribution.
 */

"use strict";

// Imports
const Unseen = require("../shadow/Unseen");

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
            
            h1 {
                font-size: 1.5em;
            }
            h2 {
                font-size: 1em;
            }
            h3 {
                font-size: 0.75em;
            }
            h4 {
                font-size: 0.5em;
            }
            
            
            a {
                font-style: normal;
            }
            
            .card {
                border: 1px dashed red;
            }
            
            footer.entity-item {
                display: flex;
                flex-direction: row-reverse;
                justify-content: space-between;
            }
        </style>
        `;
    }
}

// Exports
module.exports = EntityViewList;
