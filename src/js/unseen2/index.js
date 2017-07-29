/**
 * @file index.js
 * @description Module index.
 * @license See LICENSE file included in this distribution.
 */

// Imports
const Unseen = require("./Unseen");


// DEFINE CLASSES
// SCHEMA
// const schema = {"id": 0, "idn": "unnamed", "class": "unknown", "type": "unknown", "name": "Unnamed"};

// MODEL
class EntityModel extends Unseen.Model {
    initialize() {
        this.baseSchema = {"id": 0, "idn": "unnamed", "class": "unknown", "type": "unknown", "name": "Unnamed"};
    }
}

// MODEL COLLECTION
class EntityModelList extends Unseen.ModelList {
    initialize() {
        this.baseClass = EntityModel;
    }
}

// TEMPLATE
// class EntityTemplate extends Unseen.Template {
//     initialize() {
//         this.baseSchema = {"id": 0, "idn": "unnamed", "class": "unknown", "type": "unknown", "name": "Unnamed"};
//     }
//
//     build(model, idx) {
//
//         return `
//             <div class="card-header">
//                 <h4 class="card-title">${model.id}</h4>
//                 <h6 class="card-subtitle">${model.name}</h6>
//             </div>
//             <div class="card-body">
//                 ${model.id}: ${model.type} - ${model.name}
//             </div>
//             <div class="card-footer">
//                 <button id="button-delete" class="btn btn-primary">Delete</button>
//             </div>
//         `;
//     }
// }

// VIEW
class EntityContainerView extends Unseen.View {

    initialize() {
        this.baseClass = EntityModel;
        this.id = "my-item";
        this.tag = "div";
        this.classList = ["card"];
    }

    template(model, idx) {

        return `
            <div class="container">
                <div class="columns">
                    <div class="column col-6">col-6</div>
                    <div class="column col-3">col-3</div>
                    <div class="column col-2">col-2</div>
                    <div class="column col-1">col-1</div>
                </div>
                
                <div class="columns col-gapless">
                    <div class="column col-6">col-6</div>
                    <div class="column col-6">col-6</div>
                </div>
            </div>
        `;
    }
}

class EntityView extends Unseen.View {

    initialize() {
        this.baseClass = EntityModel;
        this.id = "my-item";
        this.tag = "div";
        this.classList = ["card"];
    }

    template(model, idx) {

        return `
            <div class="panel">
                <div class="panel-header">
                    <div class="panel-title">Comments</div>
                </div>
                <div class="panel-nav">
                    <!-- navigation components: tabs, breadcrumbs or pagination -->
                </div>
                <div class="panel-body">
                    <!-- contents -->
                </div>
                <div class="panel-footer">
                    <!-- buttons or inputs -->
                </div>
            </div>
        `;
    }

    events() {
        return {
            "#button-delete": ["click", "actionDelete"]
        };
    }

    actionDelete(evt) {
        console.log(`deleteAction for ${this._id} called by ${JSON.stringify(evt)}.`);
        this.destroy();
    }
}

class EntityViewItem extends Unseen.View {

    initialize() {
        this.baseClass = EntityModel;
        this.id = "my-item";
        this.tag = "div";
        this.classList = ["card"];
    }

    template(model, idx) {

        return `
            <div class="card-header">
                <h4 class="card-title">${model.id}</h4>
                <h6 class="card-subtitle">${model.name}</h6>
            </div>
            <div class="card-body">
                ${model.id}: ${model.type} - ${model.name}
            </div>
            <div class="card-footer">
                <button id="button-delete" class="btn btn-primary">Delete</button>
            </div>
        `;
    }

    events() {
        return {
            "#button-delete": ["click", "actionDelete"]
        };
    }

    actionDelete(evt) {
        console.log(`deleteAction for ${this._id} called by ${JSON.stringify(evt)}.`);
        this.destroy();
    }
}

// VIEW LIST
class EntityViewList extends Unseen.ViewList {
    initialize() {
        this.baseClass = EntityViewItem;
        // this.useDOM = false;
        this.target = "body";
        this.tag = "main";
        this.id = "my-list";
        this.classList = ["container"];
    }
}

// CREATE INSTANCES
let rawData = require("../../data/processed_sample.json");

let entityModelList = new EntityModelList(rawData);
let entityViewList = new EntityViewList(entityModelList);

// CREATE APP.

const app = new Unseen.Controller();
app.addModel("models", entityModelList);
app.addView("views", entityViewList);
app.start();
