let exampleDefinition = {
    a: "cat",
    b: "hat",
    c: 3
};

function makeModel(definition) {

    let _keys = Object.keys(definition);

    let Model = function(record, parent) {
        this._parent = parent;
        this._defaults = definition;
        this._record = {};

        for(let key of _keys) {

            Object.defineProperty(this, key, {
                get: function() { return this._record[key]; },
                set: function(value) { this._record[key] = value; }
            });

            this._record[key] = record[key] || this._defaults[key];
        }
    };

    Model.prototype._dump = function() {
        return JSON.stringify(this._record);
    };

    return Model;
}

const MyModel = makeModel(exampleDefinition);

let myModel = new MyModel({a: "something", b: "other"});
console.log(myModel.b);

let myModel2 = new MyModel({a: "hoobie", b: "homie", c: 3});
console.log(myModel2.b);

console.log(myModel.b);
console.log(myModel2._dump());
