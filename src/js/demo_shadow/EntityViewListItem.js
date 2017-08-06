/**
 * @file EntityListItemView.js
 * @description EntityListItemView component.
 * @license See LICENSE file included in this distribution.
 */

"use strict";

// Imports
const Unseen = require("../shadow/Unseen");

// VIEW
class EntityListItemView extends Unseen.View {

    initialize() {
        // this.baseModel = myModel;
        this.id = "my-item";
        this.tag = "article";
        this.classList = ["card"];
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

    events() {
        return {
            "#button-delete": ["click", "deleteAction"]
        };
    }

    deleteAction(evt) {
        console.log(`deleteAction for ${this._id} called by ${JSON.stringify(evt)}.`);
        this.destroy();
    }
}

// Exports
module.exports = EntityListItemView;