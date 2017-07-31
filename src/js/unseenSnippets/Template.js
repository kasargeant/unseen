/**
 * @file Template.js
 * @description The Template class.
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
 * The Template class.
 *
 * Responsibilities:-
 * * To hold a set of data attributes - equivalent to a database record.
 *
 * Characteristics:-
 * * To be accessible 'as if' it were a simple key-value object.
 * * To optionally validate data.
 * @class
 */
class Template {
    /**
     * @param {Object} baseSchema - An object representing the schema of data to be used by this template.
     * @param {Object} [options={}] - Instance options to override class/custom defaults.
     * @param {Object} [options.record={}] - A data record object.
     * @param {View|ViewList} [parent] - The parent (if any).
     * @param {number} [parentRef] - The parent's reference ID for this component (if any).
     * @constructor
     */
    constructor(baseSchema = null, options = {}, parent = null, parentRef = 0) {

        // Component defaults
        this.defaults = {
            baseSchema: null,
            template: null,
            record: {},
            url: null
        };

        // Set internally (or by parent).
        this._parent = parent;  // The parent component (if any).
        this._id = parentRef;   // The parent's reference ID for this component (if any).

        // Set by user (or default).
        // Order of precedence is: Custom properties -then-> Instance options -then-> class defaults.
        this.initialize();      // Custom initialization.
        this.baseSchema = baseSchema || options.baseSchema || this.baseSchema || this.defaults.baseSchema;

        // Set depending on previous internal/user properties.

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

    /**
     * Method that returns the result of building the template with an instance of model data.
     * @param {model} [model={}] - The data Model instance.
     * @param {number} [idx] - The index number if this template is being used by a ViewList.
     * @returns {string} - The built template result.
     * @override
     */
    build(model={}, idx) {

        return "";
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // UTILITY METHODS
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    toJSON() {
        return JSON.stringify(this._data);
    }
}

EventEmitter(Template.prototype);

// Exports
module.exports = Template;
