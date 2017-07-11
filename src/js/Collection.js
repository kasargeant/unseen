"use strict";

function Collection(ModelClass) {
    this.ModelClass = ModelClass;
    this.models = [];
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

Collection.prototype.dump = function() {
    for(let i = 0; i < this.models.length; i++) {
        console.log(this.models[i].dump());
    }
};


// Exports
module.exports = Collection;
