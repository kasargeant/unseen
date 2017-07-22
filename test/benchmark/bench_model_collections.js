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
class MyBaseModelCollection extends UnseenInherited.BaseModelCollection {
    constructor(data) {
        super(MyBaseModel, data);
    }
}
let myBaseModelCollection = new MyBaseModelCollection(rawData);


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
class MyInheritedModelCollection extends UnseenInherited.ModelCollection {
    initialize() {
        this.baseClass = MyInheritedModel;
    }
}
let myInheritedModelCollection = new MyInheritedModelCollection(rawData);

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ES2015 SETUP (COMPOSITIONAL)

// SCHEMA
const schema = {"id": 0, "idn": "unnamed", "class": "unknown", "type": "unknown", "name": "Unnamed"};

// MODEL
let myModel = new Unseen.Model({"id": 123, "idn": "015695954", "type": "test", "name": "Test Street"}, {schema: schema});

// MODEL COLLECTION
let myModelCollection = new Unseen.ModelCollection(rawData, {schema: schema});


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
        return myBaseModelCollection.get(4);
    })
    .add(`An ES2015 Class View (inheritance design).`, function() {
        return myInheritedModelCollection.get(4);

    })
    .add(`An ES2015 Class View (compositional design).`, function() {
        return myModelCollection.get(4);
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
