/**
 * @file EntityListItemView.js
 * @description EntityListItemView component.
 * @license See LICENSE file included in this distribution.
 */

"use strict";

// Imports
const Unseen = require("../../index");

// VIEW
class EntityListItemView extends Unseen.View {

    initialize() {
        // this.baseModel = myModel;
        this.id = "my-item";
        this.tag = "article";
        this.classList = ["card"];
    }

    events() {
        return {
            "#button-delete": ["click", "deleteAction"]
        };
    }

    template(model, idx) {

        return `
            <header class="entity-item">
                <h1 class="card-title">${model.id}</h1>
                <h3 class="card-subtitle">${model.name}</h3>
            </header>
            <section class="body">
                ${model.id}: ${model.type} - ${model.name}
            </section>
            <footer>
                <button id="button-delete" class="btn">Delete</button>
            </footer>
        `;
    }

    deleteAction(evt) {
        console.log(`deleteAction for ${this._id} called by ${JSON.stringify(evt)}.`);
        this.destroy();
    }
}

// Exports
module.exports = EntityListItemView;
