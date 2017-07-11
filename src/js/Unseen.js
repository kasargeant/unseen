// Imports
const Collection = require("./Collection");

class Unseen {

    /**
     *
     * @param definition
     * @returns {Model}
     * @example
     * let MyModel = Unseen.makeModel({
     *      a: "hi",
     *      b: "ho",
     *      c: 3
     * });
     *
     * let myModel = new MyModel({
     *      a: "hing",
     *      b: "hong"
     * });
     *
     * console.log(myModel.c);
     */
    static makeModel(definition) {

        let keys = Object.keys(definition);
        let model = definition;

        let modelConstructor = function Model(record, parent) {
            this.keys = keys;
            this.model = definition;
            //this.parent = parent;

            for(let key of this.keys) {
                let value = record[key];
                if(value !== undefined) {
                    this.model[key] = record[key];
                }
            }
        };
        modelConstructor.prototype.dump = function() {
            return JSON.stringify(model);
        };

        for(let key of keys) {
            Object.defineProperty(modelConstructor.prototype, key, {
                get: function() {
                    return model[key];
                },
                set: function(value) {
                    model[key] = value;
                    //this.parent.dispatchEvent(new Event("update"));
                }
            });
        }

        return modelConstructor;
    }

    // static makeCollection(modelClass, data) {
    //     function Collection(ModelClass) {
    //         this.ModelClass = ModelClass;
    //         this.models = [];
    //     }
    //
    //     Collection.prototype.add = function(record) {
    //         this.models.push(new this.ModelClass(record, this));
    //     };
    //
    //     Collection.prototype.set = function(records) {
    //         for(let i = 0; i < records.length; i++) {
    //             this.models.push(new this.ModelClass(records[i], this));
    //         }
    //     };
    //
    //     Collection.prototype.reset = function() {
    //         this.models = [];
    //     };
    // }
}


let MyModel = Unseen.makeModel({
    a: "hi",
    b: "ho",
    c: 3
});

let myModel = new MyModel({
    a: "hing",
    b: "hong"
});

console.log(myModel.c);


let myCollection = new Collection(MyModel);
myCollection.add({a: "hoobie", b: "homie", c: 3});
myCollection.add({a: "froobie", b: "stubie", c: 2});
myCollection.add({a: "moobie", b: "mobie", c: 4});
let model = myCollection.get(1);
console.log(model.a);
myCollection.dump();