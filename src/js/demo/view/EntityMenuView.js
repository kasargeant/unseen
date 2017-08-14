/**
 * @file EntityMenuView.js
 * @description EntityMenuView component.
 * @license See LICENSE file included in this distribution.
 */

"use strict";

// Imports
const Unseen = require("../../unseen/Unseen");

// VIEW
class EntityMenuView extends Unseen.View {

    /**
     * Initialize and target component
     */
    initialize() {
        this.target = "aside.left";
        this.tag = "nav";
        this.id = "sidebar";
        this.classList = ["column"];
    }

    /**
     * Defines 'scoped' stylesheet
     * @returns {string}
     */
    style() {
        return `
        <style>
            nav {
                display: flex;
                padding: 0.25em;
                background-color: #666;
                border-radius: .5em;
            }
            
            .column {
                flex-direction: column;
                align-items: baseline;
            }        
        
            .menu {
                display: flex;
                flex-direction: column;
                align-items: baseline;
                margin: 0;
                padding: 0.25em 0.25em;
                list-style: none;
            }
            
            .menu a {
                color: white;
                text-decoration: none;
            }
            .sub-menu a {
                color: #DDD;
                text-decoration: none;
            }           
        
            .item {
                margin-bottom: 0.25em;
            }
        </style>
        `;
    }

    /**
     * Defines component template and returns markup for the given Model instance.
     * @param {model} model - The Model instance to be used with this template.
     * @param {number} [idx] - Index number used by component parents of type list e.g. ViewList.
     * @returns {string}
     */
    template(model, idx) {

        // Build markup: item links
        let itemsMarkup = "";
        // Iterate across items
        for(let item in model.items) {
            let itemValue = model.items[item];
            console.log(`ItemKey: ${item} = ${itemValue}`);
            let itemType = typeof itemValue;
            if(itemType === "string") {
                itemsMarkup += `
                    <li class="item">
                        <a href="${itemValue}">${item}</a>
                    </li>
                `;
            } else if(itemType === "object") {
                // Open sublist
                itemsMarkup += `
                    <li class="item active">
                        <a href="#">${item}</a>
                        <ul class="sub-menu">
                `;
                // Iterate across sub-items
                for(let subItem in itemValue) {
                    let subItemValue = itemValue[subItem];
                    console.log(`SubItemKey: ${subItem} = ${subItemValue}`);
                    itemsMarkup += `
                        <li class="sub-item">
                            <a href="${subItemValue}" class="sub-item">${subItem}</a>
                        </li>
                    `;
                }
                // Close sublist
                itemsMarkup += `
                        </ul>
                    </li>
                `;
            }

        }

        // Collate returned markup
        return `
            <ul class="menu">
                ${itemsMarkup}
            </ul>
        `;

    }
}

// Exports
module.exports = EntityMenuView;
