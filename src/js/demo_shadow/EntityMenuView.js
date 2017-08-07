/**
 * @file EntityMenuView.js
 * @description EntityMenuView component.
 * @license See LICENSE file included in this distribution.
 */

"use strict";

// Imports
const Unseen = require("../shadow/Unseen");

const jQuery = require("jquery");

// VIEW
class EntityMenuView extends Unseen.View {

    initialize() {
        this.target = "aside.left";
        this.tag = "nav";
        this.id = "sidebar";
        this.classList = ["nav--column"];
    }

    style() {
        return `
        <style>
            nav {
                display: flex;
                padding: 0.25em;
                background-color: #666;
                border-radius: .5em;
            }
            
            .nav--column {
                flex-direction: column;
                align-items: baseline;
            }        
        
            /* BLOCK: menu */
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

    template(model, idx) {

        let itemsMarkup = "";
        for(let item in model.items) {
            itemsMarkup += `<a href="${model.items[item]}" class="btn">${item}</a>`;
        }

        return `
            <ul class="menu">
                <li class="item">
                    <a href="index.html#introduction">Getting started</a>
                </li>
                <li class="item">
                    <a href="elements.html">Elements</a>
                </li>
                <li class="item active">
                    <a href="layout.html">Layout</a>
                    <ul class="sub-menu">
                        <li class="item">
                            <a href="layout.html#grid">Flexbox grid</a>
                        </li>
                        <li class="item">
                            <a href="layout.html#responsive">Responsive</a>
                        </li>
                    </ul>
                </li>
                <li class="item">
                    <a href="components.html">Components</a>
                </li>
                <li class="item">
                    <a href="utilities.html">Utilities</a>
                </li>
                <li class="item">
                    <a href="experimentals.html">Experimentals</a>
                </li>
            </ul>
        `;

    }

    events() {
        return {
            "#button-search": ["click", "searchAction"]
        };
    }

    searchAction(evt, viewId) {
        let value = document.getElementById(`input-search-${viewId}`).value;
        console.log(`'searchAction' called with value: ${value}.`);
    }
}

// Exports
module.exports = EntityMenuView;
