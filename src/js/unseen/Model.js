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
    constructor(record = {}) {

        // Set internally (or by parent).
        this._parent = null;    // The parent component (if any).
        this._id = 0;           // The parent's reference ID for this component (if any).

        // Set by user (or default).
        this.baseSchema = null;
        this.url = null;
        this.lastUpdated = 0;
        this.initialize();      // LIFECYCLE CALL: INITIALIZE

        // Sanity check user initialization.
        if(this.baseSchema === null) {
            throw new Error("Model requires a base Schema.");
        }

        // Set depending on previous internal/user properties.
        this._keys = Object.keys(this.baseSchema);

        // Add getters and setters - so that this can be treated 'as if' it were its contained data object.
        this._data = {};
        for(let key of this._keys) {
            // Define property
            Object.defineProperty(this, key, {
                get: function() {
                    return this._data[key];
                },
                set: function(value) {
                    // Assign new value - or default value if none given.
                    this._data[key] = value || this.baseSchema[key];
                    // Inform parent
                    if(this._parent !== null) {this._parent.emit("model-change", this._id);}
                }
            });
            // Then assign the property a value - or default value if none given.
            this._data[key] = record[key] || this.baseSchema[key];
        }
    }


    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // USER LIFECYCLE METHODS
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

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // DATA METHODS
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

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
        this._keys = (this.baseSchema === null) ? Object.keys(this._data) : Object.keys(this.baseSchema);
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
            if(this.baseSchema !== null) {
                this._data[key] = this._data[key] || this.baseSchema[key];
            }
        }
    }

    get() {
        return this._data;
    }


    toString() {
        return JSON.stringify(this._data);
    }


    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // UTILITY METHODS
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


    _emit(eventType) {
        if(this._parent !== null) {
            // this._parent.dispatchEvent(eventType);
            this._parent.emit(eventType, this._id);
        }
    }

    /**
     * Fetches the model's data from a local or remote source.
     * @param {Function} callback
     */
    fetch(callback) {
        // Are we storing data locally - or proxying a backend?
        if(this.url === null) {
            // We're local... we call the callback immediately.
            return this._data;
        } else {
            // We're proxying... we call the callback on data receipt.
            this._rest("GET", {}, function(responseData, textStatus, jqXHR) {
                console.log("RESPONSE: " + JSON.stringify(responseData));
                // Prepare data - handling any missing/default values.
                let data = {};
                for(let key of this._keys) {
                    // Then assign the property a value - or reassign if none given. // TODO optimise this!
                    this._data[key] = responseData[key] || this.baseSchema[key];
                }
                // Fire any callback
                if(callback !== undefined) {
                    callback(this._data);
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
    store(record) {

        // Prepare data - handling any missing/default values.
        let data = {};
        for(let key of this._keys) {
            // Then assign the property a value - or reassign if none given. // TODO optimise this!
            data = record[key] || this._data[key];
        }

        // Are we storing data locally - or proxying a backend?
        if(this.url === null) {
            // We're local...
            this._data = data;
        } else {
            // We're proxying...
            this._rest("PUT", data, function(responseData, textStatus, jqXHR) {
                this._data = data;
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
                fetchival(this.url).get(data).then(success);
                break;
            case "POST":
                fetchival(this.url).post(data).then(success);
                break;
            case "PUT":
                fetchival(this.url).put(data).then(success);
                break;
            case "DELETE":
                fetchival(this.url).delete(data).then(success);
                break;
            default:

        }
        // jQuery.ajax({
        //     type: method,
        //     url: this.url,
        //     data: data,
        //     error: this._restFailure,
        //     success: success,
        //     dataType: "json"
        // });
    }


}

EventEmitter(Model.prototype);

// Exports
module.exports = Model;
