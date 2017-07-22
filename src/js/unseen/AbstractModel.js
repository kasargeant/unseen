/**
 * @file AbstractModel.js
 * @description The AbstractModel class.
 * @author Kyle Alexis Sargeant <kasargeant@gmail.com> {@link https://github.com/kasargeant https://github.com/kasargeant}.
 * @copyright Kyle Alexis Sargeant 2017
 * @license See LICENSE file included in this distribution.
 */

"use strict";

// Imports

/**
 * The AbstractModel class.
 *
 * NOTE: ALWAYS USE CLASSES DERIVED FROM THIS ABSTRACT.  IT IS NOT ADVISED TO USE THIS DIRECTLY.
 * @class
 * @abstract
 */
class AbstractModel {
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

}

// Exports
module.exports = AbstractModel;
