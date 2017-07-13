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

// Component
function ModelCollection(ModelClass, records=[]) {

    this._parent = null;
    this._id = 0;

    this.ModelClass = ModelClass;
    this.models = {};
    this.length = 0;

    let i;
    for(i = 0; i < records.length; i++) {
        this.models[i] = new this.ModelClass(records[i], this, i);
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

}

ModelCollection.prototype._emit = function(eventType) {
    if(this._parent !== null) {
        // this._parent.dispatchEvent(eventType);
        this._parent.emit(eventType, this._id);
    }
};

ModelCollection.prototype.add = function(record) {
    let id = this._modelCounter++;
    this.models[id] = new this.ModelClass(record, this, id);
    this.length++;
};

ModelCollection.prototype.get = function(id) {
    return this.models[id];
};

ModelCollection.prototype.set = function(records) {
    this.models = {};
    let i;
    for(i = 0; i < records.length; i++) {
        this.models[i] = new this.ModelClass(records[i], this, i);
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