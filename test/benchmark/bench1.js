"use strict";

const Benchmark = require("benchmark");
let suite = new Benchmark.Suite("Appending/slicing a string that's embedded in object vs array");

let benchObj = {text: ""};
let benchArr = [""];

// Benchmark
suite
    .add(`Appending to a string embedded in an object`, function() {
        benchObj.text += "hi there!";
        benchObj.text = benchObj.text.slice(9);
        return benchObj;
    })
    .add(`Appending to a string embedded in an array`, function() {
        benchArr[0] += "hi there!";
        benchArr[0] = benchArr[0].slice(9);
        return benchArr;
    })
    // add listeners
    .on("cycle", function(event) {
        console.log(String(event.target));
    })
    .on("complete", function() {
        console.log("Fastest is " + this.filter("fastest").map("name"));
    })
    // run async
    .run({"async": true});
