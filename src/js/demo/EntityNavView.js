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
        // this.baseModel = myModel;
        this.id = "my-nav";
        this.tag = "header";
        this.classList = ["navbar"];
    }

    events() {
        return {
            "#button-delete": ["click", "deleteAction"]
        };
    }

    template(model, idx) {

        return `
            <section class="navbar-section">
                <a href="#" class="navbar-brand mr-10">Unseen.js</a>
                <a href="#" class="btn btn-link">Docs</a>
                <a href="https://github.com/kasargeant/unseen" class="btn btn-link">GitHub</a>
            </section>
            <section class="navbar-section">
                <div class="input-group input-inline">
                    <input class="form-input" type="text" placeholder="search" />
                    <button class="btn btn-primary input-group-btn">Search</button>
                </div>
            </section>
        `;
        // return `
        //     <div class="card-header">
        //         <h4 class="card-title">${model.id}</h4>
        //         <h6 class="card-subtitle">${model.name}</h6>
        //     </div>
        //     <div class="card-body">
        //         ${model.id}: ${model.type} - ${model.name}
        //     </div>
        //     <div class="card-footer">
        //         <button id="button-delete" class="btn btn-primary">Delete</button>
        //     </div>
        // `;
    }

    deleteAction(evt) {
        console.log(`deleteAction for ${this._id} called by ${JSON.stringify(evt)}.`);
        this.destroy();
    }
}

// Exports
module.exports = EntityNavView;
