/**
 * @file Model.js
 * @description The Model class.
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

/**
 * The Model class.
 *
 * Responsibilities:-
 * * To hold a set of data attributes - equivalent to a database record.
 *
 * Characteristics:-
 * * To be accessible 'as if' it were a simple key-value object.
 * * To optionally validate data.
 * @class
 */
class Model {
    /**
     * @param {Object} data - A data record object.
     * @param {ModelCollection} [parent] - The parent (if any).
     * @param {number} [parentRef] - The parent's reference ID for this component (if any).
     * @constructor
     */
    constructor(data = {}, options = {}, parent = null, parentRef = null) {

        this.defaults = {
            schema: null,
            url: null
        };
        this.config = Object.assign(this.defaults, options);
// console.log("MODEL CONFIG: " + JSON.stringify(this.config));

        // Set internally (or by parent).
        this._parent = parent;  // The parent component (if any).
        this._id = parentRef;   // The parent's reference ID for this component (if any).

        // Set depending on previous internal/user properties.
        this._keys = null;
        this._data = null;
        this.reset(data);       // Add accessors.

        // Set by user (or default).
        this.initialize();      // LIFECYCLE CALL: INITIALIZE
    }

    /**
     * Add getters and setters - so that this can be treated 'as if' it were its contained data object.
     * @private
     */
    reset(data) {

        // First we delete any previously defined key accessors (if any).
        if(this._keys !== null) {
            for(let key of this._keys) {
                delete this[key];
            }
        }

        // Second, assign the new data
        this._data = data;

        // Third, set new keys and accessors.
        // - If we have a schema - enforce it's keys.
        this._keys = (this.config.schema === null) ? Object.keys(this._data) : Object.keys(this.config.schema);
        for(let key of this._keys) {
            // Define property
            Object.defineProperty(this, key, {
                get: function() {
                    return this._data[key];
                },
                set: function(value) {
                    // Assign new value - or default value if none given.
                    this._data[key] = value;
                    // Inform parent
                    if(this._parent !== null) {this._parent.emit("model-change", this._id);}
                }
            });
            // - If we have a schema... use it's defaults for any undefined or null data values.
            if(this.config.schema !== null) {
                this._data[key] = this._data[key] || this.config.schema[key];
            }
        }
    }

    get() {
        return this._data;
    }

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

    toString() {
        return JSON.stringify(this._data);
    }

    /**
     * Fetches the model's data from a local or remote source.
     * @param {Function} callback
     */
    fetch(callback) {
        // Are we storing data locally - or proxying a backend?
        if(this.config.url === null) {
            // We're local... so we call the callback immediately.
            return callback(this);
        } else {
            // We're proxying... we call the callback on data receipt.
            this._rest("GET", {}, function(resData, textStatus, jqXHR) {
                console.log("RESPONSE: " + JSON.stringify(resData));
                // Load fresh data.
                this._reset(resData);

                // Fire any callback
                if(callback !== undefined) {
                    return callback(this);
                }
            }.bind(this));
        }
    }

    /**
     * Stores the model's data to a local or remote source.
     * @param {Object} data
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
            this._rest("PUT", data, function(resData, textStatus, jqXHR) {
                // Load fresh data.
                this.reset(resData);
                return callback(this);
            });
        }
    }

    _restFailure(jqXHR, textStatus, errorThrown) {
        console.error(`Model Error: Failure to sync data with backend.  \n${errorThrown}`);
    }

    _restSuccess() {

    }

    _rest(method="GET", data=[], success) {
        console.log("Model: FETCHING!!!");
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

EventEmitter(Model.prototype);

// Exports
module.exports = Model;


// let myModel = new Model({"id": 123, "idn": "015695954", "type": "test", "name": "Test Street"});
// console.log(myModel.idn);