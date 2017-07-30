/**
 * @file ModelList.js
 * @description The ModelList class.
 * @author Kyle Alexis Sargeant <kasargeant@gmail.com> {@link https://github.com/kasargeant https://github.com/kasargeant}.
 * @copyright Kyle Alexis Sargeant 2017
 * @license See LICENSE file included in this distribution.
 */

"use strict";

// Imports
const EventEmitter = require("event-emitter");
const Util = require("./Util");


const Model = require("./Model");

/**
 * The ModelList class.
 *
 * Responsibilities:-
 * * To hold a list of data models - equivalent to a database table.
 * @class
 */
class ModelList {

    /**
     * @param {Array} records - An array of data record objects.
     * @param {Object} [options={}] - Instance options to override class/custom defaults.
     * @param {ModelList} [parent] - The parent (if any).
     * @param {number} [parentRef] - The parent's reference ID for this component (if any).
     * @constructor
     */
    constructor(records = null, options = {}, parent = null, parentRef = 0) {

        // Component defaults
        this.defaults = {
            baseClass: null,
            records: [],
            url: null
        };

        // Set internally (or by parent).
        this._parent = parent;  // The parent component (if any).
        this._id = parentRef;   // The parent's reference ID for this component (if any).

        // Set by user (or default).
        // Order of precedence is: Custom properties -then-> Instance options -then-> class defaults.
        this.initialize();      // Custom initialization.
        this.baseClass = options.baseClass || this.baseClass || this.defaults.baseClass;
        this.url = options.url || this.url || this.defaults.url;

        this.lastUpdated = 0;

        // Sanity check user initialization.
        if(this.baseClass === null) {
            throw new Error("ModelList requires a base Model class.");
        }

        // Set depending on previous internal/user properties.
        this.models = {};
        this.length = 0;

        if(this.url === null) {
            this.reset(records || options.records || this.defaults.records);
        }

        // Adds internal events listener used by the Model to signal this ModelList on update.
        this.on("change", function(args) {
            console.log(`ModelList #${this._id}: Model #${args} changed.`);
            this.emit("change"); // Relay the event forward
        });

        this.on("view-remove", function(args) {
            console.log(`ModelList #${this._id}: View #${args} changed.`);
            console.log(`ModelList #${this._id}: Removing Model #${args}`);
            console.log("exists? " + (this.models[args] !== undefined));
            delete this.models[args];
            console.log("exists? " + (this.models[args] !== undefined));
            this.emit("change"); // Relay the event forward
        });
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // USER LIFECYCLE METHODS
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    /**
     * A lifecycle method - called when the instance is first constructed.
     * @override
     */
    initialize() {}

    // /**
    //  * A lifecycle method - called when the instance is about to be destroyed.
    //  * @override
    //  */
    // finalize() {}

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // DATA METHODS
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    reset(records) {
        this.models = {};
        // Instantiate ModelList's contents
        let id;
        for(id = 0; id < records.length; id++) {
            // Instantiate new model and set private properties.
            this.models[id] = new this.baseClass("Model_" + id, records[id]);
            this.models[id]._parent = this;
            this.models[id]._id = id;
            this.models[id].url = `${this.url}/${id}`;
        }
        this.length = id;
        this._modelCounter = id; // This provides a unique ID for every model.
        this.emit("reset", this._id);
    }

    get(id) {
        if(id === undefined) {
            return this.models;
        } else {
            return this.models[id];
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
            throw new Error("ModelList Error: Attempt to set without using a data array.");
        }
    }

    add(key, value) {
        let id = this._modelCounter++;
        this.models[id] = new this.baseClass(key, value, this, id);
        this.length++;
        return id;
    }

    remove(id) {
        let removed = this.models[id];
        if(removed !== undefined) {
            delete this.models[id];
            this.length--;
        }
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
        if(this.url === null) {
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
        if(this.url === null) {
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

EventEmitter(ModelList.prototype);

// Exports
module.exports = ModelList;

// LOCAL TEST
// const schema = {"id": 0, "idn": "unnamed", "class": "unknown", "type": "unknown", "name": "Unnamed"};
//
// class MyModel extends Model {
//     initialize() {
//         this.baseSchema = schema;
//     }
// }
// class MyModelList extends ModelList {
//     initialize() {
//         this.baseClass = MyModel;
//     }
// }
// let myModelList = new MyModelList([
//     {"id": 123, "idn": "015695954", "type": "test", "name": "Test Street"},
//     {"id": 124, "idn": "040430544", "type": "test", "name": "Test Avenue"},
//     {"id": 125, "idn": "384894398", "type": "test", "name": "Test Lane"},
// ]);
// let myModel = myModelList.get(1);
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
// class MyModelList extends ModelList {
//     initialize() {
//         this.baseClass = MyModel;
//         this.url = "http://localhost:8080/entity";
//     }
// }
//
// let myModelList = new MyModelList();
// myModelList.on("reset", function() {
//     console.log(this.length);
// }.bind(myModelList));
// myModelList.fetch();
