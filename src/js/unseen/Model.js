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
     * @param {Object} base - The record Schema and default values this Model is to be defined by.
     * @param {Object} [record] - A data object to initially populate this ModelCollection.
     * @param {ModelCollection} [parent] - The parent ModelCollection (if any).
     * @param {number} [parentRefId] - The parent's reference ID for this component (if any).
     * @constructor
     */
    constructor(base={}, record = {}, parent = null, parentRefId = 0) {

        // Set internally (or by parent).
        this._parent = parent; // The parent component.
        this._id = parentRefId; // The parent's reference ID for this component.

        // Set by constructor (or default).
        this.base = base;

        // Set by user.
        this.initialize();  // LIFECYCLE CALL: INITIALIZE

        // Set depending on previous internal/user properties.
        this._keys = Object.keys(this.base);
        this._record = {};

        for(let key of this._keys) {

            Object.defineProperty(this, key, {
                get: function() {
                    return this._record[key];
                },
                set: function(value) {
                    this._record[key] = value;
                    this._emit("change");
                }
            });

            this._record[key] = record[key] || this.base[key];
        }
        this.length = 1; // Always 1... included only for compatibility with Collection interface.
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // LIFECYCLE METHODS
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    /**
     * @override
     */
    initialize() {}

    /**
     * @override
     */
    finalize() {}

    _emit(eventType) {
        if(this._parent !== null) {
            // this._parent.dispatchEvent(eventType);
            this._parent.emit(eventType, this._id);
        }
    }

    reset() {
        this._record = {}; // For compatibility with Collection interface
    }

    get() {
        return this; // For compatibility with Collection interface
    }

    set() {
        return this; // TODO - Implement a finer granularity of Model methods
    }

    _dump() {
        return JSON.stringify(this._record);
    }

}

// Exports
module.exports = Model;
