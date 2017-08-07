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

    style() {
        return `
        <style>
            nav {
                display: flex;
                background-color: lightgray;
                border-radius: .5em;
            }
            .nav--row {
                flex-direction: row;
                flex-wrap: wrap;
                justify-content: space-between;
                align-items: baseline;
            }

            /* BLOCK: menu */
            .menu {
                display: flex;
                margin: 0;
                padding: 0.25em 0.25em;
                list-style-type: none;
            }
            
            .menu a {
                padding: 0 1em;
                text-decoration: none;
                background-color: darkgrey;
                border-radius: .5em;
            }
        
            .menu--row {
                display: flex;
                flex-direction: row;
                flex-wrap: wrap;
                justify-content: space-between;
                align-items: baseline;
                list-style: none;
            }
            .menu--row li {
                align-items: center;
                height: 2.5em;
            }
        
            .menu--row__title {
                margin: .25em 0.125em;
                font: 2em "Rubik Black";
            }
        
            .menu--row__search {
                white-space: nowrap;
            }
        
            .menu--row__item {
                margin-right: 1em;
            }
        </style>
        `;
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
module.exports = EntityNavView;
