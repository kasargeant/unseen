"use strict";

// Imports
const Benchmark = require("benchmark");
let suite = new Benchmark.Suite("ES51 vs ES2015 Views");

// Unit
const UnseenInherited = require("../../src/js/unseen_inheritance/unseen");
const Unseen = require("../../src/index");

// Data
let rawData = require("../data/processed_sample.json");

// ES51 SETUP

// MODEL
class MyBaseModel extends UnseenInherited.BaseModel {
    constructor(record, parent) {
        let definition = {"id": 0, "idn": "unnamed", "class": "unknown", "type": "unknown", "name": "Unnamed"};
        super(definition, record, parent);
    }
}
let myBaseModel = new MyBaseModel({"id": 123, "idn": "015695954", "type": "test", "name": "Test Street"});

// MODEL COLLECTION
class MyBaseModelList extends UnseenInherited.BaseModelList {
    constructor(data) {
        super(MyBaseModel, data);
    }
}
let myBaseModelList = new MyBaseModelList(rawData);

// VIEW
class MyBaseView extends UnseenInherited.BaseView {

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
let myBaseView = new MyBaseView(myBaseModel);

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ES2015 SETUP (INHERITANCE)

// MODEL
class MyInheritedModel extends UnseenInherited.Model {
    initialize() {
        this.baseSchema = {"id": 0, "idn": "unnamed", "class": "unknown", "type": "unknown", "name": "Unnamed"};
    }
}
let myInheritedModel = new MyInheritedModel({"id": 123, "idn": "015695954", "type": "test", "name": "Test Street"});

// MODEL COLLECTION
class MyInheritedModelList extends UnseenInherited.ModelList {
    initialize() {
        this.baseClass = MyInheritedModel;
    }
}
let myInheritedModelList = new MyInheritedModelList(rawData);

// VIEW
class MyInheritedView extends UnseenInherited.View {

    initialize() {
        this.baseModel = myInheritedModel;
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
let myInheritedView = new MyInheritedView(myInheritedModel);

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ES2015 SETUP (COMPOSITIONAL)

// SCHEMA
const schema = {"id": 0, "idn": "unnamed", "class": "unknown", "type": "unknown", "name": "Unnamed"};

// MODEL
let myModel = new Unseen.Model({"id": 123, "idn": "015695954", "type": "test", "name": "Test Street"}, {schema: schema});

// MODEL COLLECTION
let myModelList = new Unseen.ModelList(rawData, {schema: schema});

// VIEW
class MyView extends Unseen.View {

    initialize() {
        this.baseModel = myModel;
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
let myView = new MyView(myModel);


// PRE-BENCH PROOF
// let markupResultES51 = {html: ""};
// myBaseView._renderMarkup(false, markupResultES51);
// console.log(markupResultES51.html);
//
//
// let markupResultES2015_inheritance = {html: ""};
// myInheritedView._renderMarkup(false, markupResultES2015_inheritance);
// console.log(markupResultES2015_inheritance.html);
//
// let markupResultES2015_compositional = {html: ""};
// myView._renderMarkup(false, markupResultES2015_compositional);
// console.log(markupResultES2015_compositional.html);
//
// console.log("MATCHED RESULTS? " + (markupResultES51.html === markupResultES2015_inheritance.html));
// console.log("MATCHED RESULTS? " + (markupResultES2015_inheritance.html === markupResultES2015_compositional.html));


// BENCHMARK
suite
    .add(`An ES51 Function-based View.`, function() {
        let result = {html: ""};
        myBaseView._renderMarkup(false, result);
        return result.html;
    })
    .add(`An ES2015 Class View (inheritance design).`, function() {
        let result = {html: ""};
        myInheritedView._renderMarkup(false, result);
        return result.html;
    })
    .add(`An ES2015 Class View (compositional design).`, function() {
        let result = {html: ""};
        myView._renderMarkup(false, result);
        return result.html;
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
