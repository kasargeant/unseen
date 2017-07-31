/**
 * @file EntityNavView.js
 * @description EntityNavView component.
 * @license See LICENSE file included in this distribution.
 */

"use strict";

// Imports
const Unseen = require("../../index");

// VIEW
class EntityNavView extends Unseen.View {

    initialize() {
        // this.baseModel = new Unseen.Model("nav-model", {baseSchema: {
        //     title: "Unseen.js",
        //     items: {
        //         "About": "#",
        //         "Docs": "https://kasargeant.github.io/unseen/api/",
        //         "GitHub": "https://github.com/kasargeant/unseen"
        //     }
        // }});
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
                    <input class="form-input" type="text" placeholder="search" />
                    <button id="button-search" class="btn btn-primary input-group-btn">Search</button>
                </div>
            </section>
        `;

    }

    searchAction(evt) {
        console.log(`'searchAction' called with value: ${JSON.stringify(evt)}.`);
        this.destroy();
    }
}

// Exports
module.exports = EntityNavView;
