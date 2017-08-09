/**
 * @file EntityListItemView.js
 * @description EntityListItemView component.
 * @license See LICENSE file included in this distribution.
 */

"use strict";

// Imports
const Unseen = require("../../unseen/Unseen");

// VIEW
class EntityListItemView extends Unseen.View {

    /**
     * Initialize and target component
     */
    initialize() {
        this.id = "entity-item";
        this.tag = "article";
        this.classList = [];
    }

    /**
     * Defines 'scoped' stylesheet
     * @returns {string}
     */
    style() {
        return `
        <style>
                        
            article {
                margin-bottom: 0.25em;
                padding: 0.25em;
                background-color: lightgray;
                border-radius: .5em;
            }
            
            h1 {
                font-size: 1.5em;
            }
            h2 {
                font-size: 1em;
            }
            
            a {
                font-style: normal;
            }
            
            header {}
            
            footer {
                display: flex;
                flex-direction: row-reverse;
                justify-content: space-between;
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

        return `
            <header>
                <h2 class="subtitle">${model.id}</h2>
                <h1 class="title">${model.name}</h1>
            </header>
            <section>
                ${model.id}: ${model.type} - ${model.name}
            </section>
            <footer>
                <button id="button-delete" class="btn">Delete</button>
            </footer>
        `;
    }

    /**
     * Defines and returns the event lookup table for this component.
     * @returns {Object} - the event lookup table for this component.
     */
    events() {
        return {
            "#entity-item": ["click", "focusAction"],
            "#button-delete": ["click", "deleteAction"]
        };
    }

    /**
     * A custom search action method for this component.
     * @param {Event} evt - The event that triggered this method.
     * @param {number} viewId - The UUID of the component target.
     */
    deleteAction(evt) {
        console.log(`deleteAction for ${this._id} called by ${JSON.stringify(evt)}.`);
        this.destroy();
    }

    /**
     * A custom focus action - that opens details of this entity in another view.
     * @param {Event} evt - The event that triggered this method.
     * @param {number} viewId - The UUID of the component target.
     */
    focusAction(evt) {
        console.log(`focusAction for ${this._id} called by ${JSON.stringify(evt)}.`);

    }
}

// Exports
module.exports = EntityListItemView;
