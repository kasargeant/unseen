/**
 * @file EntityDetailView.js
 * @description EntityDetailView component.
 * @license See LICENSE file included in this distribution.
 */

"use strict";

// Imports
const Unseen = require("../../unseen/Unseen");

const jQuery = require("jquery");

// VIEW
class EntityDetailView extends Unseen.View {

    /**
     * Initialize and target component
     */
    initialize() {
        this.target = "aside.right";
        this.tag = "section";
        this.id = "detail";
        this.classList = [];
    }

    /**
     * Defines 'scoped' stylesheet
     * @returns {string}
     */
    style() {
        return `
        <style>
            section.detail {
                padding: .25em;
                background-color: lightgray;
                border-radius: .5em;
            }
            .list {}
            .item {
                padding-bottom: .25em;
                list-style-type: decimal-leading-zero;
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

        let itemsMarkup = "";
        for(let item in model.items) {
            itemsMarkup += `<a href="${model.items[item]}" class="btn btn-link">${item}</a>`;
        }

        return `
            <h2>Comments</h2>
            <ul class="list">
                <li class="item">
                    Bla blab blbb lblabbl l lbalb lablbalab lba
                </li>
                <li class="item">
                    Bla blab blbb lblabbl l lbalb lablbalab lba
                    Bla blab blbb lblabbl l lbalb lablbalab lba
                </li>
                <li class="item">
                    Bla blab blbb lblabbl l lbalb lablbalab lba
                </li>
                <li class="item">
                    Bla blab blbb lblabbl l lbalb lablbalab lba
                    Bla blab blbb lblabbl l lbalb lablbalab lba
                    Bla blab blbb lblabbl l lbalb lablbalab lba
                </li>
                <li class="item">
                    Bla blab blbb lblabbl l lbalb lablbalab lba
                    Bla blab blbb lblabbl l lbalb lablbalab lba
                </li>
            </ul>
        `;

    }
}

// Exports
module.exports = EntityDetailView;
