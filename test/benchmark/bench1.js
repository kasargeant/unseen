"use strict";

const Benchmark = require("benchmark");
let suite = new Benchmark.Suite("Relative selector speeds: id vs data-");


const chalk = require("chalk");
const colors = require("colors/safe");
const tinter = require("tinter");

// Benchmark
suite
    .add(`chalk - single color i.e. chalk.red("hi there!")`, function() {
        return chalk.red("hi there!");
    })
    .add(`colors.js - single color i.e. colors.red("hi there!")`, function() {
        return colors.red("hi there!");
    })
    .add(`tinter - single color i.e. tinter.red("hi there!")`, function() {
        return tinter.red("hi there!");
    })
    .add(`tinter#2 - single color i.e. tinter.style("hi there!", "red")`, function() {
        return tinter.style("hi there!", "red");
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
