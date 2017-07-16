"use strict";

// Imports
const Benchmark = require("benchmark");
let suite = new Benchmark.Suite("ES51 vs ES2015 Views");

// Unit
const Unseen = require("../../src/index");

// Data
let rawData = require("../data/processed_sample.json");

// ES51 SETUP

// MODEL
class MyBaseModel extends Unseen.BaseModel {
    constructor(record, parent) {
        let definition = {"id": 0, "idn": "unnamed", "class": "unknown", "type": "unknown", "name": "Unnamed"};
        super(definition, record, parent);
    }
}
let myBaseModelInstance = new MyBaseModel({"id": 123, "idn": "015695954", "type": "test", "name": "Test Street"});

// MODEL COLLECTION
class MyBaseModelCollection extends Unseen.BaseModelCollection {
    constructor(data) {
        super(MyBaseModel, data);
    }
}
let myBaseModelCollectionInstance = new MyBaseModelCollection(rawData);

// VIEW
class MyBaseView extends Unseen.BaseView {

    initialize() {
        this.id = "my-item";
        this.tag = "div";
        this.classList = ["card"];
    }

    events() {
        return {
            "#button-delete": ["click", "deleteAction"]
        };
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

    deleteAction(evt) {
        console.log(`deleteAction for ${this._id} called by ${JSON.stringify(evt)}.`);
        this.destroy();
    }
}
let myBaseViewInstance = new MyBaseView(myBaseModelInstance);

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ES2015 SETUP

// MODEL
class MyModel extends Unseen.Model {
    constructor(record, parent) {
        let definition = {"id": 0, "idn": "unnamed", "class": "unknown", "type": "unknown", "name": "Unnamed"};
        super(definition, record, parent);
    }
}
let myModelInstance = new MyModel({"id": 123, "idn": "015695954", "type": "test", "name": "Test Street"});

// MODEL COLLECTION
class MyModelCollection extends Unseen.ModelCollection {
    constructor(data) {
        super(MyModel, data);
    }
}
let myModelCollectionInstance = new MyModelCollection(rawData);

// VIEW
class MyView extends Unseen.View {

    initialize() {
        this.id = "my-item";
        this.tag = "div";
        this.classList = ["card"];
    }

    events() {
        return {
            "#button-delete": ["click", "deleteAction"]
        };
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

    deleteAction(evt) {
        console.log(`deleteAction for ${this._id} called by ${JSON.stringify(evt)}.`);
        this.destroy();
    }
}
let myViewInstance = new MyView(myModelInstance);

// PRE-BENCH PROOF
// let markupResultES51 = {html: ""};
// myBaseViewInstance._renderMarkup(false, markupResultES51);
// console.log(markupResultES51.html);
//
//
// let markupResultES2015 = {html: ""};
// myViewInstance._renderMarkup(false, markupResultES2015);
// console.log(markupResultES2015.html);
//
// console.log("MATCHED RESULTS? " + (markupResultES51.html === markupResultES2015.html));


// BENCHMARK
suite
    .add(`An ES51 Function-based View.`, function() {
        return myBaseViewInstance._renderMarkup(false, {html: ""});
    })
    .add(`An ES2015 Class-based View.`, function() {
        return myViewInstance._renderMarkup(false, {html: ""});
    })
    // add listeners
    .on("cycle", function(event) {
        console.log(String(event.target));
    })
    .on("complete", function() {
        console.log("Fastest is " + this.filter("fastest").map("name"));
    })
    // run async
    .run({"async": true});
