/**
 * @file Collection.js
 * @description The Collection class.
 * @author Kyle Alexis Sargeant <kasargeant@gmail.com> {@link https://github.com/kasargeant https://github.com/kasargeant}.
 * @copyright Kyle Alexis Sargeant 2017
 * @license See LICENSE file included in this distribution.
 */

"use strict";

// Imports
const EventEmitter = require("event-emitter");

// Component
function Collection(ModelClass, records=[]) {

    this._parent = null;
    this._id = 0;

    this.ModelClass = ModelClass;
    this.models = [];

    let i;
    for(i = 0; i < records.length; i++) {
        this.models.push(new this.ModelClass(records[i], this, i));
    }
    this._modelCounter = i; // This provides a unique ID for every model.

    Object.defineProperty(this, "length", {
        get: function() { return this.models.length; }
    });

    this.on("change", function(args) {
        console.log(`Collection #${this._id}: Model #${args} changed.`);
        this._emit("change"); // Relay the event forward
    });

}

Collection.prototype._emit = function(eventType) {
    if(this._parent !== null) {
        // this._parent.dispatchEvent(eventType);
        this._parent.emit(eventType, this._id);
    }
};

Collection.prototype.add = function(record) {
    let model = new this.ModelClass(record, this, this._modelCounter++);
    this.models.push(model);
};

Collection.prototype.get = function(idx) {
    return this.models[idx];
};

Collection.prototype.set = function(records) {
    for(let i = 0; i < records.length; i++) {
        this.models.push(new this.ModelClass(records[i], this, this._modelCounter++));
    }
};

Collection.prototype.reset = function() {
    this.models = [];
};

Collection.prototype._dump = function() {
    for(let i = 0; i < this.models.length; i++) {
        console.log(this.models[i]._dump());
    }
};

EventEmitter(Collection.prototype);

// Exports
module.exports = Collection;
