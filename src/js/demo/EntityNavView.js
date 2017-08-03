/**
 * @file EntityNavView.js
 * @description EntityNavView component.
 * @license See LICENSE file included in this distribution.
 */

"use strict";

// Imports
const Unseen = require("../../index");

const jQuery = require("jquery");

// VIEW
class EntityNavView extends Unseen.View {

    initialize() {
        this.target = "header";
        this.tag = "nav";
        this.id = "my-nav";
        this.classList = ["navbar"];
    }

    events() {
        return {
            "#button-search": ["click", "searchAction"]
        };
    }

    template(model, idx) {

        let itemsMarkup = "";
        for(let item in model.items) {
            itemsMarkup += `<li class="menu-item"><a href="${model.items[item]}" class="btn btn-link">${item}</a></li>`;
        }

        return `
            <h1 class="menu">${model.title}</h1>
            <ul class="menu menu-row">
                ${itemsMarkup}
            </ul>
            <div class="search">
                <input id="input-search" class="form-input" type="text" placeholder="search" />
                <button id="button-search" class="btn btn-primary input-group-btn">Search</button>
            </div>
        `;

    }

    searchAction(evt, viewId) {
        let value = document.getElementById(`input-search-${viewId}`).value;
        console.log(`'searchAction' called with value: ${value}.`);
    }
}

// Exports
module.exports = EntityNavView;
