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
                <h3 class="subtitle">${model.id}</h3>
                <h1 class="title">${model.name}</h1>
            </header>
            <section class="entity-item">
                ${model.id}: ${model.type} - ${model.name}
            </section>
            <footer class="entity-item">
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
