/**
 * @file index.js
 * @description Module index.
 * @license See LICENSE file included in this distribution.
 */

"use strict";

// Imports
const EntityModelList = require("./EntityModelList");
const EntityListViewList = require("./EntityViewList");
const EntityNavView = require("./EntityNavView");

// const jQuery = require("jquery");

let rawData = require("../../data/processed_sample.json");

// MODEL COLLECTION
let myModelList = new EntityModelList(rawData);

// VIEW
let myNavView = new EntityNavView();

// VIEW COLLECTION
let myViewList = new EntityListViewList(myModelList);

myViewList.collection.fetch();

// DEMO: CONSOLE
// let markupResult = {html: ""};
// myViewList._renderMarkup(false, markupResult);
// console.log(markupResult.html);
//
// // DEMO: BROWSER
// console.log(`Testing with ${myModelList.length} records.`);
// console.time("render");
//
// myViewCollection.render(true);
//
// console.timeEnd("render");
//
// console.time("insert");
// jQuery(document).ready(function() {
//     // Action after append is completely done
//     console.timeEnd("insert");
// });
//
