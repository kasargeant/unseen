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
        this.target = "body";
        this.tag = "header";
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
            itemsMarkup += `<a href="${model.items[item]}" class="btn btn-link">${item}</a>`;
        }

        return `
            <section class="navbar-section">
                <a href="/" class="navbar-brand mr-10">${model.title}</a>
                ${itemsMarkup}
            </section>
            <section class="navbar-section">
                <div class="input-group input-inline">
                    <input id="input-search" class="form-input" type="text" placeholder="search" />
                    <button id="button-search" class="btn btn-primary input-group-btn">Search</button>
                </div>
            </section>
        `;

    }

    searchAction(evt, viewId) {
        let value = document.getElementById(`input-search-${viewId}`).value;
        console.log(`'searchAction' called with value: ${value}.`);
    }
}

// Exports
module.exports = EntityNavView;
