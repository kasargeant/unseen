/**
 * @file EntityNavView.js
 * @description EntityNavView component.
 * @license See LICENSE file included in this distribution.
 */

"use strict";

// Imports
const Unseen = require("../shadow/Unseen");

const jQuery = require("jquery");

// VIEW
class EntityNavView extends Unseen.View {

    initialize() {
        this.target = "header";
        this.tag = "nav";
        this.id = "my-nav";
        this.classList = ["nav--row"];
    }

    events() {
        return {
            "#button-search": ["click", "searchAction"]
        };
    }

    template(model, idx) {

        let itemsMarkup = "";
        for(let item in model.items) {
            itemsMarkup += `<li class="menu--row__item"><a href="${model.items[item]}" class="btn btn-link">${item}</a></li>`;
        }

        return `
            <h1 class="menu--row__title">${model.title}</h1>
            <ul class="menu menu-row">
                ${itemsMarkup}
            </ul>
            <div class="menu--row__search">
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
