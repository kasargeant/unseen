/**
 * @file BaseModel.js
 * @description The Base Model class (standard inheritance).
 * @author Kyle Alexis Sargeant <kasargeant@gmail.com> {@link https://github.com/kasargeant https://github.com/kasargeant}.
 * @copyright Kyle Alexis Sargeant 2017
 * @license See LICENSE file included in this distribution.
 */

"use strict";

/**
 * The base Model class.
 * @param definition
 * @param record
 * @param parent
 * @param collectionId
 * @constructor
 */
const BaseModel = function(base={}, record={}, parent=null, collectionId=0) {

    // Set internally (or by parent).
    this._id = collectionId; // An internal ID only.
    this._parent = parent; // Note: Parent can EITHER be a collection OR a view. NOT BOTH.

    // Set by user (or default).
    this.base = base;
    this.initialize();  // LIFECYCLE CALL: INITIALIZE

    // Calculated from previous internal/user properties.
    this._keys = Object.keys(this.base);
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

        this._record[key] = record[key] || this.base[key];
    }
    this.length = 1; // Always 1... included only for compatibility with Collection interface.
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// LIFECYCLE METHODS
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

/**
 * @override
 */
BaseModel.prototype.initialize = function() {};

/**
 * @override
 */
BaseModel.prototype.finalize = function() {};

BaseModel.prototype._emit = function(eventType) {
    if(this._parent !== null) {
        // this._parent.dispatchEvent(eventType);
        this._parent.emit(eventType, this._id);
    }
};

BaseModel.prototype.get = function() {
    return this; // For compatibility with Collection interface
};

BaseModel.prototype._dump = function() {
    return JSON.stringify(this._record);
};

// Exports
module.exports = BaseModel;