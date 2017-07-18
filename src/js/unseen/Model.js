/**
 * @file Model.js
 * @description The Model class.
 * @author Kyle Alexis Sargeant <kasargeant@gmail.com> {@link https://github.com/kasargeant https://github.com/kasargeant}.
 * @copyright Kyle Alexis Sargeant 2017
 * @license See LICENSE file included in this distribution.
 */

"use strict";

// Imports
const jQuery = require("jquery");


/**
 * The Model class.
 *
 * Responsibilities:-
 * * TODO...
 * @class
 */
class Model {
    /**
     * @param {Object} [record] - A data record object.
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

    /**
     * @override
     */
    initialize() {}

    /**
     * @override
     */
    finalize() {}

    reset() {
        this._data = JSON.parse(JSON.stringify(this.baseSchema)); // Clone the base schema.
    }

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
        jQuery.ajax({
            type: method,
            url: this.url,
            data: data,
            error: this._restFailure,
            success: success,
            dataType: "json"
        });
    }

    toString() {
        return JSON.stringify(this._data);
    }

}

// Exports
module.exports = Model;
