/**
 * @file Collection.js
 * @description A collection prototype.
 * @author Kyle Alexis Sargeant <kasargeant@gmail.com> {@link https://github.com/kasargeant https://github.com/kasargeant}.
 * @copyright Kyle Alexis Sargeant 2017
 * @license See LICENSE file included in this distribution.
 */

function Collection(ModelClass) {
    "use strict";

    this.ModelClass = ModelClass;
    this.models = [];
}

Collection.prototype.add = function(record) {
    "use strict";

    let model = new this.ModelClass(record, this);
    this.models.push(model);
};

Collection.prototype.get = function(idx) {
    "use strict";

    return this.models[idx];
};

Collection.prototype.set = function(records) {
    "use strict";

    for(let i = 0; i < records.length; i++) {
        this.models.push(new this.ModelClass(records[i], this));
    }
};

Collection.prototype.reset = function() {
    "use strict";

    this.models = [];
};

Collection.prototype._dump = function() {
    "use strict";

    for(let i = 0; i < this.models.length; i++) {
        console.log(this.models[i]._dump());
    }
};


// Exports
module.exports = Collection;
