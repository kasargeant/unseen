/**
 * @file Collection.js
 * @description The Collection class.
 * @author Kyle Alexis Sargeant <kasargeant@gmail.com> {@link https://github.com/kasargeant https://github.com/kasargeant}.
 * @copyright Kyle Alexis Sargeant 2017
 * @license See LICENSE file included in this distribution.
 */

"use strict";

function Collection(ModelClass, records=[]) {
    this.ModelClass = ModelClass;
    this.models = [];
    for(let i = 0; i < records.length; i++) {
        this.models.push(new this.ModelClass(records[i], this));
    }
    Object.defineProperty(this, "length", {
        get: function() { return this.models.length; }
    });
}

Collection.prototype.add = function(record) {
    let model = new this.ModelClass(record, this);
    this.models.push(model);
};

Collection.prototype.get = function(idx) {
    return this.models[idx];
};

Collection.prototype.set = function(records) {
    for(let i = 0; i < records.length; i++) {
        this.models.push(new this.ModelClass(records[i], this));
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

// Exports
module.exports = Collection;
