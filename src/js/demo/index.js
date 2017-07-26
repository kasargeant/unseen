/**
 * @file index.js
 * @description Module index.
 * @license See LICENSE file included in this distribution.
 */

"use strict";

// Imports
const EntityModelCollection = require("./EntityModelCollection");
const EntityListViewCollection = require("./EntityListViewCollection");
const EntityNavView = require("./EntityNavView");

// const jQuery = require("jquery");

let rawData = require("../../data/processed_sample.json");

// MODEL COLLECTION
let myModelCollection = new EntityModelCollection(rawData);

// VIEW
let myNavView = new EntityNavView();

// VIEW COLLECTION
let myViewCollection = new EntityListViewCollection(myModelCollection);

// DEMO: CONSOLE
// let markupResult = {html: ""};
// myViewCollection._renderMarkup(false, markupResult);
// console.log(markupResult.html);
//
// // DEMO: BROWSER
// console.log(`Testing with ${myModelCollection.length} records.`);
// console.time("render");
//
// // myViewCollection._render(true);
// // myViewCollection._renderMarkup(true);
//
// console.timeEnd("render");
//
// console.time("insert");
// jQuery(document).ready(function() {
//     // Action after append is completely done
//     console.timeEnd("insert");
// });
//
