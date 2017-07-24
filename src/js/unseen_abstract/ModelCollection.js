/**
 * @file ModelCollection.js
 * @description The ModelCollection class.
 * @author Kyle Alexis Sargeant <kasargeant@gmail.com> {@link https://github.com/kasargeant https://github.com/kasargeant}.
 * @copyright Kyle Alexis Sargeant 2017
 * @license See LICENSE file included in this distribution.
 */

"use strict";

// Imports
const EventEmitter = require("event-emitter");
const fetchival = require("fetchival");
if(typeof window === "undefined") {
    fetchival.fetch = require("node-fetch");
}

const Model = require("./Model");

/**
 * The ModelCollection class.
 *
 * Responsibilities:-
 * * To hold a list of data models - equivalent to a database table.
 * @class
 */
class ModelCollection {
    /**
     * @param {Array} data - An array of data record objects.
     * @param {ModelCollection} [parent] - The parent (if any).
     * @param {number} [parentRef] - The parent's reference ID for this component (if any).
     * @constructor
     */
    constructor(data = [], options = {}, parent = null, parentRef = null) {

        // Args guard
        if(!Array.isArray(data)) {
            throw new Error("Attempt to instantiate AbstractModelCollection without a data array.");
        }

        // Create sensible defaults-based config.
        this.defaults = {
            schema: null,
        };
        this.config = Object.assign(this.defaults, options);

        // Set internally (or by parent).
        this._parent = parent;  // The parent component (if any).
        this._id = parentRef;   // The parent's reference ID for this component (if any).

        // Set by user (or default).
        this.initialize();      // LIFECYCLE CALL: INITIALIZE

        // Set depending on previous internal/user properties.
        this.models = null;
        this.length = 0;
        this.reset(data);       // Add accessors.

        // Adds internal events listener used by the Model to signal this AbstractModelCollection on update.
        this.on("change", function(args) {
            console.log(`AbstractModelCollection #${this._id}: Model #${args} changed.`);
            this._emit("change"); // Relay the event forward
        });

        this.on("view-remove", function(args) {
            console.log(`AbstractModelCollection #${this._id}: View #${args} changed.`);
            console.log(`AbstractModelCollection #${this._id}: Removing Model #${args}`);
            console.log("exists? " + (this.models[args] !== undefined));
            delete this.models[args];
            console.log("exists? " + (this.models[args] !== undefined));
            this._emit("change"); // Relay the event forward
        });
    }
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // LIFECYCLE METHODS
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    /**
     * A lifecycle method - called when the instance is first constructed.
     * @override
     */
    initialize() {}

    /**
     * A lifecycle method - called when the instance is about to be destroyed.
     * @override
     */
    finalize() {}

    _emit(eventType) {
        if(this._parent !== null) {
            // this._parent.dispatchEvent(eventType);
            this._parent.emit(eventType, this._id);
        }
    }

    /**
     * Add getters and setters - so that this can be treated 'as if' it were its contained data object.
     * @private
     */
    reset(data) {
        // Initialise collection's contents.
        this.models = {};

        // Instantiate AbstractModelCollection's contents
        for(let id = 0; id < data.length; id++) {
            // Instantiate new model and set private properties.
            // this.models[id] = new Model(data[id], this, id);
            this.models[id] = new Model(data[id], {
                schema: this.config.schema,
                url: ((this.url !== null) ? `${this.url}/${id}` : null)
            }, this, id);
        }
        this.length = data.length;
    }

    get(id) {
        if(id === undefined) {
            return this.models;
        } else {
            return this.models[id];
        }
    }

    set(data) {
        if(Array.isArray(data)) {
            this.models = {};
            let i;
            for(i = 0; i < data.length; i++) {
                this.models[i] = new this.baseClass(data[i], this, i);
            }
            this.length = i;
            this._modelCounter = i; // This provides a unique ID for every model.
        } else {
            throw new Error("AbstractModelCollection Error: Attempt to set without using a data array.");
        }
    }

    add(record) {
        let id = this._modelCounter++;
        this.models[id] = new this.baseClass(record, this, id);
        this.length++;
    }

    toString() {
        for(let id in this.models) {
            console.log(this.models[id]._dump());
        }
    }

    /**
     * Fetches the collection's data from a local or remote source.
     * @param {Function} callback
     */
    fetch(callback) {
        // Are we storing data locally - or proxying a backend?
        if(this.config.url === null) {
            // We're local... we call the callback immediately.
            callback(this);
        } else {
            // We're proxying... we call the callback on data receipt.
            this._rest("GET", {}, function(resData, textStatus, jqXHR) {
                console.log("RESPONSE: " + JSON.stringify(resData));
                // Load fresh data.
                this.reset(resData);

                // Fire any callback
                if(callback !== undefined) {
                    return callback(this);
                }
            }.bind(this));
        }
    }

    /**
     * Stores the collection's data to a local or remote source.
     * @param {Array} data
     * @param {Function} callback
     * @returns {*}
     */
    store(data, callback) {
        // Are we storing data locally - or proxying a backend?
        if(this.config.url === null) {
            // We're local... so we call the callback immediately.
            return callback(this);
        } else {
            // We're proxying...
            this._rest("POST", data, function(resData, textStatus, jqXHR) {
                // Load fresh data.
                this._reset(resData);
                return callback(this);
            });
        }
    }

    _restFailure(jqXHR, textStatus, errorThrown) {
        console.error(`Model Error: Failure to sync data with backend.  \n${errorThrown}`);
    }

    _restSuccess() {

    }

    /**
     * Strategy: HTTP/HTTPS
     * @param method
     * @param data
     * @param success
     * @private
     */
    _rest(method="GET", data=[], success) {
        console.log("ModelCollection: FETCHING!!!");
        switch(method) {
            case "GET":
                fetchival(this.config.url).get(data).then(success);
                break;
            case "POST":
                fetchival(this.config.url).post(data).then(success);
                break;
            case "PUT":
                fetchival(this.config.url).put(data).then(success);
                break;
            case "DELETE":
                fetchival(this.config.url).delete(data).then(success);
                break;
            default:

        }
    }

}

EventEmitter(ModelCollection.prototype);

// Exports
module.exports = ModelCollection;


// let myModelCollection = new ModelCollection([
//     {"id": 123, "idn": "015695954", "type": "test", "name": "Test Street"},
//     {"id": 124, "idn": "040430544", "type": "test", "name": "Test Avenue"},
//     {"id": 125, "idn": "384894398", "type": "test", "name": "Test Lane"},
// ]);
// let myModel = myModelCollection.get(1);
// console.log(myModel.toString());