/**
 * @file Model.js
 * @description The Model class.
 * @author Kyle Alexis Sargeant <kasargeant@gmail.com> {@link https://github.com/kasargeant https://github.com/kasargeant}.
 * @copyright Kyle Alexis Sargeant 2017
 * @license See LICENSE file included in this distribution.
 */

"use strict";

const Model = function(record={}, parent=null, collectionId=0) {

    // Set internally (or by parent).
    this._id = collectionId; // An internal ID only.
    this._parent = parent; // Note: Parent can EITHER be a collection OR a view. NOT BOTH.

    // Set by user (or default).
    this._defaults = {};
    this.initialize();  // LIFECYCLE CALL: INITIALIZE

    // Calculated from previous internal/user properties.
    this._keys = Object.keys(this._defaults);
    this._record = {};

    for(let key of this._keys) {

        Object.defineProperty(this, key, {
            get: function() {
                return this._record[key];
            },
            set: function(value) {
                this._record[key] = value;
                this._emit("change");
            }
        });

        this._record[key] = record[key] || this._defaults[key];
    }
    this.length = 1; // Always 1... included only for compatibility with Collection interface.
};

Model.prototype._emit = function(eventType) {
    if(this._parent !== null) {
        // this._parent.dispatchEvent(eventType);
        this._parent.emit(eventType, this._id);
    }
};

Model.prototype.get = function() {
    return this; // For compatibility with Collection interface
};

Model.prototype._dump = function() {
    return JSON.stringify(this._record);
};

// Exports
module.exports = Model;
