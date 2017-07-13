// Imports
const Unseen = require("./UnseenFactory");


let MyModel = Unseen.makeModel({
    a: "hi",
    b: "ho",
    c: 3
});

let myModel = new MyModel({
    a: "ha",
    b: "he"
});
let myModelB = new MyModel({
    a: "hing",
    b: "hong",
    c: 2
});
console.log(myModel.c);
console.log(myModelB.c);
console.log(myModel.a);
console.log(myModelB.a);


// let myCollection = new Collection(MyModel);

const Collection = Unseen.makeCollection(MyModel);
let myCollection = new Collection();

myCollection.add({a: "hoobie", b: "homie", c: 3});
myCollection.add({a: "froobie", b: "stubie", c: 2});
myCollection.add({a: "moobie", b: "mobie", c: 4});
let model = myCollection.get(1);
console.log(model.a);
myCollection._dump();

// alt collection
const AnotherCollection = Unseen.makeCollection(Unseen.makeModel({
    x: "hi",
    y: "ho"
}));
let anotherCollection = new AnotherCollection([
    {x: 10, y: 20},
    {x: 11, y: 20},
    {x: 14, y: 19}
]);
let modelAnother = anotherCollection.get(1);
console.log(modelAnother.x);
anotherCollection._dump();


let myCollection2 = new Collection();
myCollection2.add({a: "hoobie2", b: "homie2", c: 31});
myCollection2.add({a: "froobie2", b: "stubie2", c: 21});
myCollection2.add({a: "moobie2", b: "mobie2", c: 41});
let model2 = myCollection2.get(1);
console.log(model2.a);
myCollection2._dump();

