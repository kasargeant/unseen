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
     * @param {ModelCollection} [parent] - The parent ModelCollection (if any).
     * @param {number} [parentRefId] - The parent ModelCollection's reference ID for this ModelList (if any).
     * @constructor
     */
    constructor(records = [], parent = null, parentRefId = 0) {

        // Set internally (or by parent).
        this._parent = parent; // The parent component.
        this._id = parentRefId; // The parent's reference ID for this component.

        // Set by user (or default).
        this.baseClass = null;
        this.initialize();  // LIFECYCLE CALL: INITIALIZE

        // Calculated from previous internal/user properties.
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
            console.log(`ModelList #${this._id}: Model #${args} changed.`);
            this._emit("change"); // Relay the event forward
        });

        this.on("view-remove", function (args) {
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


//
// /**
//  * @param {Array} records - A data array to initially populate this ModelList.
//  * @param {ModelList} [parent] - The parent ModelList (if any).
//  * @param {number} [parentRefId] - The parent ModelList's reference ID for this ModelList (if any).
//  * @constructor
//  */
// function ModelList(records=[], parent=null, parentRefId=0) {
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
//         console.log(`ModelList #${this._id}: Model #${args} changed.`);
//         this._emit("change"); // Relay the event forward
//     });
//
//     this.on("view-remove", function(args) {
//         console.log(`ModelList #${this._id}: View #${args} changed.`);
//         console.log(`ModelList #${this._id}: Removing Model #${args}`);
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
// ModelList.prototype.initialize = function() {};
//
// /**
//  * @override
//  */
// ModelList.prototype.finalize = function() {};
//
// ModelList.prototype._emit = function(eventType) {
//     if(this._parent !== null) {
//         // this._parent.dispatchEvent(eventType);
//         this._parent.emit(eventType, this._id);
//     }
// };
//
// ModelList.prototype.reset = function() {
//     this.models = {};
// };
//
// ModelList.prototype.get = function(id) {
//     return this.models[id];
// };
//
// ModelList.prototype.set = function(records) {
//     this.models = {};
//     let i;
//     for(i = 0; i < records.length; i++) {
//         this.models[i] = new this.baseClass(records[i], this, i);
//     }
//     this.length = i;
//     this._modelCounter = i; // This provides a unique ID for every model.
// };
//
// ModelList.prototype.add = function(record) {
//     let id = this._modelCounter++;
//     this.models[id] = new this.baseClass(record, this, id);
//     this.length++;
// };
//
// ModelList.prototype._dump = function() {
//     for(let id in this.models) {
//         console.log(this.models[id]._dump());
//     }
// };
//
// EventEmitter(ModelList.prototype);
//
// // Exports
// module.exports = ModelList;
