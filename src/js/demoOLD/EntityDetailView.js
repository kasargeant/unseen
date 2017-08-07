/**
 * @file EntityDetailView.js
 * @description EntityDetailView component.
 * @license See LICENSE file included in this distribution.
 */

"use strict";

// Imports
const Unseen = require("../../index");

const jQuery = require("jquery");

// VIEW
class EntityDetailView extends Unseen.View {

    initialize() {
        this.target = "aside.right";
        this.tag = "section";
        this.id = "detail";
        this.classList = [];
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
            <h2>Comments</h2>
            <ul class="msg">
                <li class="msg-item">
                    Bla blab blbb lblabbl l lbalb lablbalab lba
                </li>
                <li class="msg-item">
                    Bla blab blbb lblabbl l lbalb lablbalab lba
                    Bla blab blbb lblabbl l lbalb lablbalab lba
                </li>
                <li class="msg-item">
                    Bla blab blbb lblabbl l lbalb lablbalab lba
                </li>
                <li class="msg-item">
                    Bla blab blbb lblabbl l lbalb lablbalab lba
                    Bla blab blbb lblabbl l lbalb lablbalab lba
                    Bla blab blbb lblabbl l lbalb lablbalab lba
                </li>
                <li class="msg-item">
                    Bla blab blbb lblabbl l lbalb lablbalab lba
                    Bla blab blbb lblabbl l lbalb lablbalab lba
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
module.exports = EntityDetailView;
