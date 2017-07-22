/**
 * @file ModelList.js
 * @description The ModelList class.
 * @author Kyle Alexis Sargeant <kasargeant@gmail.com> {@link https://github.com/kasargeant https://github.com/kasargeant}.
 * @copyright Kyle Alexis Sargeant 2017
 * @license See LICENSE file included in this distribution.
 */

"use strict";

// Imports
const EventEmitter = require("event-emitter");

/**
 * The ModelList class.
 *
 * Responsibilities:-
 * * TODO...
 * @class
 */
class ModelList {

    /**
     * @param {Array} [records] - A data array to initially populate this ModelList.
     * @constructor
     */
    constructor(records = []) {

        // Set internally (or by parent).
        this._parent = null;    // The parent component (if any).
        this._id = 0;           // The parent's reference ID for this component (if any).

        // Set by user (or default).
        this.baseClass = null;
        this.initialize();      // LIFECYCLE CALL: INITIALIZE

        // Sanity check user initialization.
        if(this.baseClass === null) {
            throw new Error("ModelList requires a base Model class.");
        }

        // Set depending on previous internal/user properties.
        this.models = {};
        this.length = 0;

        let i;
        for(i = 0; i < records.length; i++) {
            this.models[i] = new this.baseClass(records[i], this, i);
        }
        this.length = i;
        this._modelCounter = i; // This provides a unique ID for every model.

        // Adds internal events listener used by the Model to signal this ModelList on update.
        this.on("change", function(args) {
            console.log(`ModelList #${this._id}: Model #${args} changed.`);
            this._emit("change"); // Relay the event forward
        });

        this.on("view-remove", function(args) {
            console.log(`ModelList #${this._id}: View #${args} changed.`);
            console.log(`ModelList #${this._id}: Removing Model #${args}`);
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

    reset() {
        this.models = {};
    }

    get(id) {
        return this.models[id];
    }

    set(records) {
        this.models = {};
        let i;
        for(i = 0; i < records.length; i++) {
            this.models[i] = new this.baseClass(records[i], this, i);
        }
        this.length = i;
        this._modelCounter = i; // This provides a unique ID for every model.
    }

    add(record) {
        let id = this._modelCounter++;
        this.models[id] = new this.baseClass(record, this, id);
        this.length++;
    }

    _dump() {
        for(let id in this.models) {
            console.log(this.models[id]._dump());
        }
    }

}

EventEmitter(ModelList.prototype);

// Exports
module.exports = ModelList;
