/**
 * @file Model.js
 * @description The Model class.
 * @author Kyle Alexis Sargeant <kasargeant@gmail.com> {@link https://github.com/kasargeant https://github.com/kasargeant}.
 * @copyright Kyle Alexis Sargeant 2017
 * @license See LICENSE file included in this distribution.
 */

"use strict";

// Imports
const Component = require("./Component");

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
 * @extends Component
 */
class Model extends Component {
    /**
     * @param {Object} data - A data record object.
     * @param {Object} [options] - Component configuration options.
     * @param {Component} [parent] - The parent (if any).
     * @param {number} [parentRef] - The parent's reference ID for this component (if any).
     * @constructor
     */
    constructor(data={}, options, parent, parentRef) {

        // Specialized component defaults
        let defaults = {
            schema: null,
            url: null
        };
        super(defaults, options, parent, parentRef);

        // Specialized component properties.
        this._keys = null;
        this._data = null;
        this.reset(data);       // Add accessors.
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
                    this.emit("set");
                }
            });
            // - If we have a schema... use it's defaults for any undefined or null data values.
            if(this.config.schema !== null) {
                this._data[key] = this._data[key] || this.config.schema[key];
            }
        }
        // Inform parent (if any).
        this.emit("reset");
    }

    set(data) {
        if(this.config.schema !== null) {
            // - If we have a schema... use it's defaults for any undefined or null data values.
            for(let dataKey in data) {
                if(this.config.schema[dataKey] !== undefined) {
                    this._data[dataKey] = data[dataKey] || this.config.schema[dataKey];
                }
            }
        } else {
            // Otherwise - just enforce whatever key/field names we have and nothing more.
            for(let dataKey in data) {
                if(this._data[dataKey] !== undefined) {
                    this._data[dataKey] = data[dataKey];
                }
            }
        }

        // Inform parent (if any).
        this.emit("set");
    }

    get() {
        return this._data;
    }

    toString() {
        return JSON.stringify(this._data);
    }
}

// Exports
module.exports = Model;


// let myModel = new Model({"id": 123, "idn": "015695954", "type": "test", "name": "Test Street"});
// console.log(myModel.idn);