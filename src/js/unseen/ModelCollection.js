/**
 * @file ModelCollection.js
 * @description The ModelCollection class.
 * @author Kyle Alexis Sargeant <kasargeant@gmail.com> {@link https://github.com/kasargeant https://github.com/kasargeant}.
 * @copyright Kyle Alexis Sargeant 2017
 * @license See LICENSE file included in this distribution.
 */

"use strict";

// Imports
const EventEmitter = require("event-emitter");

/**
 * The ModelCollection class.
 *
 * Responsibilities:-
 * * TODO...
 * @class
 */
class ModelCollection {

    /**
     * @param {Array} records - A data array to initially populate this ModelCollection.
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
            throw new Error("ModelCollection requires a base Model class.");
        }

        // Set depending on previous internal/user properties.
        this.models = {};
        this.length = 0;

        let id;
        for(id = 0; id < records.length; id++) {
            // Instantiate new model and set private properties.
            this.models[id] = new this.baseClass(records[id]);
            this.models[id]._parent = this;
            this.models[id]._id = id;
        }
        this.length = id;
        this._modelCounter = id; // This provides a unique ID for every model.

        // Adds internal events listener used by the Model to signal this ModelCollection on update.
        this.on("change", function(args) {
            console.log(`ModelCollection #${this._id}: Model #${args} changed.`);
            this._emit("change"); // Relay the event forward
        });

        this.on("view-remove", function(args) {
            console.log(`ModelCollection #${this._id}: View #${args} changed.`);
            console.log(`ModelCollection #${this._id}: Removing Model #${args}`);
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

EventEmitter(ModelCollection.prototype);

// Exports
module.exports = ModelCollection;
