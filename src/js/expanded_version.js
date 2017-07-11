let exampleDefinition = {
    a: "cat",
    b: "hat",
    c: 3
};
let exampleRecord = {
    a: "something",
    b: "other"
};
function MyIdealModel(record, parent) {
    this._parent = parent;
    this._record = exampleDefinition;
    this._keys = Object.keys(exampleDefinition);
    for(let key of this._keys) {
        let value = record[key];
        if(value !== undefined) {
            this._record[key] = record[key];
        }
    }
}
Object.defineProperty(MyIdealModel.prototype, "a", {
    get: function() { return this._record["a"]; },
    set: function(value) { this._record["a"] = value; }
});
Object.defineProperty(MyIdealModel.prototype, "b", {
    get: function() { return this._record["b"]; },
    set: function(value) { this._record["b"] = value; }
});
Object.defineProperty(MyIdealModel.prototype, "c", {
    get: function() { return this._record["c"]; },
    set: function(value) { this._record["c"] = value; }
});

let myModel = new MyIdealModel(exampleRecord);
console.log(myModel.c);