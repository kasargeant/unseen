/**
 * @file BaseModelCollection.js
 * @description The Base ModelCollection class.
 * @author Kyle Alexis Sargeant <kasargeant@gmail.com> {@link https://github.com/kasargeant https://github.com/kasargeant}.
 * @copyright Kyle Alexis Sargeant 2017
 * @license See LICENSE file included in this distribution.
 */

"use strict";

// Imports
const EventEmitter = require("event-emitter");

/**
 * The base ModelCollection class.
 * @param ModelClass
 * @param records
 * @constructor
 */
function BaseModelCollection(ModelClass, records=[]) {

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
        console.log(`BaseModelCollection #${this._id}: Model #${args} changed.`);
        this._emit("change"); // Relay the event forward
    });

    this.on("view-remove", function(args) {
        console.log(`BaseModelCollection #${this._id}: View #${args} changed.`);
        console.log(`BaseModelCollection #${this._id}: Removing Model #${args}`);
        console.log("exists? " + (this.models[args] !== undefined));
        delete this.models[args];
        console.log("exists? " + (this.models[args] !== undefined));
        this._emit("change"); // Relay the event forward
    });
}

BaseModelCollection.prototype._emit = function(eventType) {
    if(this._parent !== null) {
        // this._parent.dispatchEvent(eventType);
        this._parent.emit(eventType, this._id);
    }
};

BaseModelCollection.prototype.add = function(record) {
    let id = this._modelCounter++;
    this.models[id] = new this.ModelClass(record, this, id);
    this.length++;
};

BaseModelCollection.prototype.get = function(id) {
    return this.models[id];
};

BaseModelCollection.prototype.set = function(records) {
    this.models = {};
    let i;
    for(i = 0; i < records.length; i++) {
        this.models[i] = new this.ModelClass(records[i], this, i);
    }
    this.length = i;
    this._modelCounter = i; // This provides a unique ID for every model.
};

BaseModelCollection.prototype.reset = function() {
    this.models = {};
};

BaseModelCollection.prototype._dump = function() {
    for(let id in this.models) {
        console.log(this.models[id]._dump());
    }
};

EventEmitter(BaseModelCollection.prototype);

// Exports
module.exports = BaseModelCollection;
