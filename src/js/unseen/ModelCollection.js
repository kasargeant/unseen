/**
 * @file ModelCollection.js
 * @description The ModelCollection class.
 * @author Kyle Alexis Sargeant <kasargeant@gmail.com> {@link https://github.com/kasargeant https://github.com/kasargeant}.
 * @copyright Kyle Alexis Sargeant 2017
 * @license See LICENSE file included in this distribution.
 */

"use strict";

// Imports
const Component = require("./Component");
const Util = require("./Util");


const Model = require("./Model");

/**
 * The ModelCollection class.
 *
 * Responsibilities:-
 * * To hold a list of data models - equivalent to a database table.
 * @class
 * @private - TODO implement
 */
class ModelCollection extends Component {

    /**
     * @param {Object} data - A data object of nested record objects/arrays.
     * @param {Object} [options={}] - Instance options to override class/custom defaults.
     * @param {Object} [options.baseModels={}] - The base Models that this collection should use.
     * @param {ModelCollection} [parent] - The parent (if any).
     * @constructor
     */
    constructor(data = null, options = {}, parent = null) {

        // Call Component constructor
        super(parent);

        // Set by user (or default).
        this.defaults = {
            baseModels: null,
            data: {},
            url: null
        };
        this.config = Object.assign(this.defaults, options);

        // Order of precedence is: Custom properties -then-> Instance options -then-> class defaults.
        this.baseModels = this.config.baseModels || this.baseModels;
        this.url = this.config.url || this.url;

        // Sanity check component construction requirements.
        if(!this.baseModels) {
            throw new Error("ModelCollection requires at least one base Model class.");
        }

        // Set depending on previous internal/user properties.
        this.models = {};
        this.length = 0;

        // Instantiate the collection's Models
        for(let key in this.baseModels) {
            this.models[key] = new this.baseModels[key]();
        }

        if(!this.url) {
            this.reset(data || this.config.data);
        }

        // Adds internal events listener used by the Model to signal this ModelCollection on update.
        this.on("change", function(args) {
            console.log(`ModelCollection #${this._id}: Model #${args} changed.`);
            this.emit("change"); // Relay the event forward
        });

        this.on("view-remove", function(args) {
            console.log(`ModelCollection #${this._id}: View #${args} changed.`);
            console.log(`ModelCollection #${this._id}: Removing Model #${args}`);
            console.log("exists? " + (this.models[args] !== undefined));
            delete this.models[args];
            console.log("exists? " + (this.models[args] !== undefined));
            this.emit("change"); // Relay the event forward
        });
    }

    // Overrides Component super method
    receive(src, msg) {
        console.log(`Component '${this._id}' received message: ${JSON.stringify(msg)} from: ${src._id}`);
        if(["remove"].includes(msg.action)) {
            this[msg.action](msg.arg);
        } else {
            console.error(`ModelCollection received unrecognised message: ${JSON.stringify(msg)}`)
        }
    }


    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // DATA METHODS
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    reset(records) {

        this.models = {};



        // Instantiate ModelCollection's contents
        let i;
        for(i = 0; i < records.length; i++) {

            // Instantiate new model and set private properties.
            let model = new this.baseClass(records[i], {}, this);

            // Determine index property and thus index value
            let indexKey = model.indexBy;
            let id = model[indexKey];

            // Set models with new model instance and index with determined key.
            this.models[id] = model;
            this.models[id].url = `${this.url}/${id}`;
        }
        this.length = i;
        this.emit("reset", this._id);
    }

    get(key) {
        if(key === undefined) {
            return this.models;
        } else {
            return this.models[key];
        }

    }

    set(records) {
        if(Array.isArray(records)) {
            this.models = {};
            let id;
            for(id = 0; id < records.length; id++) {
                this.models[id] = new this.baseClass("Model_" + id, records[id], this, id);
            }
            this.length = id;
            this._modelCounter = id; // This provides a unique ID for every model.
        } else {
            throw new Error("ModelCollection Error: Attempt to set without using a data array.");
        }
    }

    add(key, value) {
        this.models[key] = new this.baseClass(value, this);
        this.length++;
        return key;
    }

    remove(key) {
        console.log("ModelCollection.remove() called.");
        console.log(`Deleting Model with index: ${key}.`);
        console.log(`- model ${(this.models[key]) ? "exists" : "doesn't exist"}`);
        let removed = this.models[key];
        if(removed !== undefined) {
            delete this.models[key];
            this.length--;
        }
    }

    find(key, value) {
        return this.models.find(function(model) {
            model[key] === value;
        });
    }


    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // UTILITY METHODS
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    toJSON() {
        let json = "[";
        for(let id in this.models) {
            json += this.models[id].toJSON() + ", ";
        }
        json[json.length - 1] = "]";
    }

    /**
     * Fetches the collection's data from a local or remote source.
     * @param {Function} callback
     */
    fetch() {
        if(!this.url) {
            this.emit("reset", this._id);
        } else {
            Util.fetch("GET", this.url, {}, function(resData) {
                console.log("RESPONSE: " + JSON.stringify(resData));
                this.reset(resData);
            }.bind(this));
        }
    }

    /**
     * Stores the collection's data to a local or remote source.
     * @param {Array} data
     * @param {Function} callback
     * @returns {*}
     */
    store(records) {

        // Prepare data - handling any missing/default values.
        let data = {};
        let i;
        for(i = 0; i < records.length; i++) {
            data[i] = new this.baseClass("Model_" + i, records[i], this, i);
        }
        this.length = i;
        this._modelCounter = i; // This provides a unique ID for every model.

        // Are we storing data locally - or proxying a backend?
        if(!this.url) {
            // We're local...
            this.models = data;
        } else {
            // We're proxying...
            Util.fetch("POST", this.url, data, function(responseData) {
                this.models = responseData;
            });
        }
    }
}

// Exports
module.exports = ModelCollection;

// // LOCAL TEST
// const schema = {"id": 0, "idn": "unnamed", "class": "unknown", "type": "unknown", "name": "Unnamed"};
//
// class MyModel extends Model {
//     initialize() {
//         this.baseSchema = schema;
//         this.indexBy = "idn";
//     }
// }
// class MyModelCollection extends ModelCollection {
//     initialize() {
//         this.baseClass = MyModel;
//     }
// }
// let myModelCollection = new MyModelCollection([
//     {"id": 123, "idn": "015695954", "type": "test", "name": "Test Street"},
//     {"id": 124, "idn": "040430544", "type": "test", "name": "Test Avenue"},
//     {"id": 125, "idn": "384894398", "type": "test", "name": "Test Lane"},
// ]);
// // let myModel = myModelCollection.get(124);
// let myModel = myModelCollection.get("384894398");
// console.log(myModel.toJSON());

// // REST TEST
// const schema = {"id": 0, "idn": "unnamed", "class": "unknown", "type": "unknown", "name": "Unnamed"};
//
// class MyModel extends Model {
//     initialize() {
//         this.baseSchema = schema;
//         // this.url = "http://localhost:8080/entity/1";
//     }
// }
// class MyModelCollection extends ModelCollection {
//     initialize() {
//         this.baseClass = MyModel;
//         this.url = "http://localhost:8080/entity";
//     }
// }
//
// let myModelCollection = new MyModelCollection();
// myModelCollection.on("reset", function() {
//     console.log(this.length);
// }.bind(myModelCollection));
// myModelCollection.fetch();
