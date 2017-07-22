/**
 * @file Component.js
 * @description The Component class.
 * @author Kyle Alexis Sargeant <kasargeant@gmail.com> {@link https://github.com/kasargeant https://github.com/kasargeant}.
 * @copyright Kyle Alexis Sargeant 2017
 * @license See LICENSE file included in this distribution.
 */

"use strict";

/**
 * The Component class.
 *
 * Responsibilities:-
 * * TODO...
 * @class
 * @private
 */
class Component {
    /**
     * @param {Object} [record] - A data object to initially populate this ModelCollection.
     * @param {ModelCollection} [parent] - The parent ModelCollection (if any).
     * @param {number} [parentRefId] - The parent ModelCollection's reference ID for this ModelCollection (if any).
     * @constructor
     */
    constructor(parent = null, parentRefId = 0) {

        // Set internally (or by parent).
        this._parent = parent; // The parent component.
        this._id = parentRefId; // The parent's reference ID for this component.

        // Set by user (or default).
        this.initialize();  // LIFECYCLE CALL: INITIALIZE
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // LIFECYCLE METHODS
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    /**
     * @override
     */
    initialize() {
        console.log(`Component: initialize() called.`);
    }

    /**
     * @override
     */
    finalize() {
        console.log(`Component: finalize() called.`);
    }

    /**
     * @override
     */
    reset() {
        console.log(`Component: reset() called.`);
    }

    /**
     * @override
     */
    get() {
        console.log(`Component: get() called.`);
    }

    /**
     * @override
     */
    set() {
        console.log(`Component: set() called.`);
    }

    /**
     * @override
     */
    _dump() {
        return JSON.stringify(this.prototype);
    }

}


// Exports
module.exports = Component;
