/**
 * @file EntityDetailView.js
 * @description EntityDetailView component.
 * @license See LICENSE file included in this distribution.
 */

"use strict";

// Imports
const Unseen = require("../shadow/Unseen");

const jQuery = require("jquery");

// VIEW
class EntityDetailView extends Unseen.View {

    initialize() {
        this.target = "aside.right";
        this.tag = "section";
        this.id = "detail";
        this.classList = [];
    }

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

    events() {
        return {
            "#button-search": ["click", "searchAction"]
        };
    }

    searchAction(evt, viewId) {
        let value = document.getElementById(`input-search-${viewId}`).value;
        console.log(`'searchAction' called with value: ${value}.`);
    }
}

// Exports
module.exports = EntityDetailView;
