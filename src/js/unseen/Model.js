/**
 * @file Model.js
 * @description The Model class.
 * @author Kyle Alexis Sargeant <kasargeant@gmail.com> {@link https://github.com/kasargeant https://github.com/kasargeant}.
 * @copyright Kyle Alexis Sargeant 2017
 * @license See LICENSE file included in this distribution.
 */

"use strict";

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

    get() {
        return this._data;
    }

    set(record) {
        for(let key of this._keys) {
            // Then assign the property a value - or reassign if none given. // TODO optimise this!
            this._data[key] = record[key] || this._data[key];
        }
    }

    toString() {
        return JSON.stringify(this._data);
    }

}

// Exports
module.exports = Model;
