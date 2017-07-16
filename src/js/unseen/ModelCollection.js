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
     * @param {Model} baseClass - An extended (i.e. schema-defined) Model class.
     * @param {Array} records - A data array to initially populate this ModelCollection.
     * @param {ModelCollection} [parent] - The parent ModelCollection (if any).
     * @param {number} [parentRefId] - The parent ModelCollection's reference ID for this ModelCollection (if any).
     * @constructor
     */
    constructor(baseClass, records = [], parent = null, parentRefId = 0) {

        // Set internally (or by parent).
        this._parent = parent; // The parent component.
        this._id = parentRefId; // The parent's reference ID for this component.

        // Set by constructor (or default).
        this.baseClass = baseClass;

        // Set by user.
        this.initialize();  // LIFECYCLE CALL: INITIALIZE

        // Set depending on previous internal/user properties.
        this.models = {};
        this.length = 0;

        let i;
        for(i = 0; i < records.length; i++) {
            this.models[i] = new this.baseClass(records[i], this, i);
        }
        this.length = i;
        this._modelCounter = i; // This provides a unique ID for every model.

        // Object.defineProperty(this, "length", {
        //     get: function() { return this.length; }
        // });

        this.on("change", function (args) {
            console.log(`ModelCollection #${this._id}: Model #${args} changed.`);
            this._emit("change"); // Relay the event forward
        });

        this.on("view-remove", function (args) {
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


//
// /**
//  * @param {Array} records - A data array to initially populate this ModelCollection.
//  * @param {ModelCollection} [parent] - The parent ModelCollection (if any).
//  * @param {number} [parentRefId] - The parent ModelCollection's reference ID for this ModelCollection (if any).
//  * @constructor
//  */
// function ModelCollection(records=[], parent=null, parentRefId=0) {
//
//     // Set internally (or by parent).
//     this._parent = parent; // The parent component.
//     this._id = parentRefId; // The parent's reference ID for this component.
//
//     // Set by user (or default).
//     this.baseClass = null;
//     this.initialize();  // LIFECYCLE CALL: INITIALIZE
//
//     // Calculated from previous internal/user properties.
//     this.models = {};
//     this.length = 0;
//
//     let i;
//     for(i = 0; i < records.length; i++) {
//         this.models[i] = new this.baseClass(records[i], this, i);
//     }
//     this.length = i;
//     this._modelCounter = i; // This provides a unique ID for every model.
//
//     // Object.defineProperty(this, "length", {
//     //     get: function() { return this.length; }
//     // });
//
//     this.on("change", function(args) {
//         console.log(`ModelCollection #${this._id}: Model #${args} changed.`);
//         this._emit("change"); // Relay the event forward
//     });
//
//     this.on("view-remove", function(args) {
//         console.log(`ModelCollection #${this._id}: View #${args} changed.`);
//         console.log(`ModelCollection #${this._id}: Removing Model #${args}`);
//         console.log("exists? " + (this.models[args] !== undefined));
//         delete this.models[args];
//         console.log("exists? " + (this.models[args] !== undefined));
//         this._emit("change"); // Relay the event forward
//     });
// }
//
// //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// // LIFECYCLE METHODS
// //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//
// /**
//  * @override
//  */
// ModelCollection.prototype.initialize = function() {};
//
// /**
//  * @override
//  */
// ModelCollection.prototype.finalize = function() {};
//
// ModelCollection.prototype._emit = function(eventType) {
//     if(this._parent !== null) {
//         // this._parent.dispatchEvent(eventType);
//         this._parent.emit(eventType, this._id);
//     }
// };
//
// ModelCollection.prototype.reset = function() {
//     this.models = {};
// };
//
// ModelCollection.prototype.get = function(id) {
//     return this.models[id];
// };
//
// ModelCollection.prototype.set = function(records) {
//     this.models = {};
//     let i;
//     for(i = 0; i < records.length; i++) {
//         this.models[i] = new this.baseClass(records[i], this, i);
//     }
//     this.length = i;
//     this._modelCounter = i; // This provides a unique ID for every model.
// };
//
// ModelCollection.prototype.add = function(record) {
//     let id = this._modelCounter++;
//     this.models[id] = new this.baseClass(record, this, id);
//     this.length++;
// };
//
// ModelCollection.prototype._dump = function() {
//     for(let id in this.models) {
//         console.log(this.models[id]._dump());
//     }
// };
//
// EventEmitter(ModelCollection.prototype);
//
// // Exports
// module.exports = ModelCollection;
