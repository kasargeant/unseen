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
 * @param records
 * @constructor
 */
function ModelCollection(records=[]) {

    // Set internally (or by parent).
    this._parent = null;
    this._id = 0;

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
ModelCollection.prototype.initialize = function() {};

/**
 * @override
 */
ModelCollection.prototype.finalize = function() {};

ModelCollection.prototype._emit = function(eventType) {
    if(this._parent !== null) {
        // this._parent.dispatchEvent(eventType);
        this._parent.emit(eventType, this._id);
    }
};

ModelCollection.prototype.add = function(record) {
    let id = this._modelCounter++;
    this.models[id] = new this.baseClass(record, this, id);
    this.length++;
};

ModelCollection.prototype.get = function(id) {
    return this.models[id];
};

ModelCollection.prototype.set = function(records) {
    this.models = {};
    let i;
    for(i = 0; i < records.length; i++) {
        this.models[i] = new this.baseClass(records[i], this, i);
    }
    this.length = i;
    this._modelCounter = i; // This provides a unique ID for every model.
};

ModelCollection.prototype.reset = function() {
    this.models = {};
};

ModelCollection.prototype._dump = function() {
    for(let id in this.models) {
        console.log(this.models[id]._dump());
    }
};

EventEmitter(ModelCollection.prototype);

// Exports
module.exports = ModelCollection;
