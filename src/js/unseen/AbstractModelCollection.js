/**
 * @file AbstractModelCollection.js
 * @description The AbstractModelCollection class.
 * @author Kyle Alexis Sargeant <kasargeant@gmail.com> {@link https://github.com/kasargeant https://github.com/kasargeant}.
 * @copyright Kyle Alexis Sargeant 2017
 * @license See LICENSE file included in this distribution.
 */

"use strict";

// Imports
const Model = require("./Model");

const EventEmitter = require("event-emitter");


/**
 * The AbstractModelCollection class.
 *
 * Responsibilities:-
 * * To hold a list of data models - equivalent to a database table.
 * @class
 */
class AbstractModelCollection {

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
                schema: null,
                url: ((this.url !== null) ? `${this.url}/${id}` : null)
            }, this, id);
        }
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

}

EventEmitter(AbstractModelCollection.prototype);

// Exports
module.exports = AbstractModelCollection;
