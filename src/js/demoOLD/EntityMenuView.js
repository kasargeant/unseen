/**
 * @file EntityMenuView.js
 * @description EntityMenuView component.
 * @license See LICENSE file included in this distribution.
 */

"use strict";

// Imports
const Unseen = require("../../index");

const jQuery = require("jquery");

// VIEW
class EntityMenuView extends Unseen.View {

    initialize() {
        this.target = "aside.left";
        this.tag = "nav";
        this.id = "sidebar";
        this.classList = ["nav--column"];
    }

    events() {
        return {
            "#button-search": ["click", "searchAction"]
        };
    }

    template(model, idx) {

        let itemsMarkup = "";
        for(let item in model.items) {
            itemsMarkup += `<a href="${model.items[item]}" class="btn">${item}</a>`;
        }

        return `
            <ul class="menu menu--column">
                <li class="menu--column__item">
                    <a href="index.html#introduction">Getting started</a>
                </li>
                <li class="menu--column__item">
                    <a href="elements.html">Elements</a>
                </li>
                <li class="menu--column__item active">
                    <a href="layout.html">Layout</a>
                    <ul class="nav">
                        <li class="menu--column__item">
                            <a href="layout.html#grid">Flexbox grid</a>
                        </li>
                        <li class="menu--column__item">
                            <a href="layout.html#responsive">Responsive</a>
                        </li>
                    </ul>
                </li>
                <li class="menu--column__item">
                    <a href="components.html">Components</a>
                </li>
                <li class="menu--column__item">
                    <a href="utilities.html">Utilities</a>
                </li>
                <li class="menu--column__item">
                    <a href="experimentals.html">Experimentals</a>
                </li>
            </ul>
        `;

    }

    searchAction(evt, viewId) {
        let value = document.getElementById(`input-search-${viewId}`).value;
        console.log(`'searchAction' called with value: ${value}.`);
    }
}

// Exports
module.exports = EntityMenuView;