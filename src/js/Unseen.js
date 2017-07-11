class Unseen {
    static makeModel(definition) {

        let keys = Object.keys(definition);
        let model = definition;

        let modelConstructor = function Model(record, parent) {

            //this.parent = parent;

            for(let key of keys) {
                let value = record[key];
                if(value !== undefined) {
                    model[key] = record[key];
                }
            }
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
