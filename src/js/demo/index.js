/**
 * @file index.js
 * @description Module index.
 * @license See LICENSE file included in this distribution.
 */

"use strict";

// Imports
const Unseen = require("../../index");
const EntityModel = require("./model/EntityModel");
const EntityModelList = require("./model/EntityModelList");
const EntityListViewList = require("./EntityViewList");
const EntityNavModel = require("./model/EntityNavModel");
const EntityNavView = require("./EntityNavView");
const EntityMenuView = require("./EntityMenuView");
const EntityDetailView = require("./EntityDetailView");

const jQuery = require("jquery");

let rawData = require("../../data/processed_half.json");

// MODEL COLLECTION
let myModelList = new EntityModelList(rawData);

// NAVBAR
let myNavModel = new EntityNavModel({
    title: "Unseen.js",
    items: {
        "About": "#",
        "Docs": "https://kasargeant.github.io/unseen/api/",
        "GitHub": "https://github.com/kasargeant/unseen"
    }
});
let myNavView = new EntityNavView(myNavModel);
myNavView.reset();


// SIDEBAR MENU
let myMenuModel = new EntityNavModel({
    title: "Unseen.js",
    items: {
        "About": "#",
        "Docs": "https://kasargeant.github.io/unseen/api/",
        "GitHub": "https://github.com/kasargeant/unseen"
    }
});
let myMenuView = new EntityMenuView(myMenuModel);
myMenuView.reset();

// VIEW COLLECTION
let myViewList = new EntityListViewList(myModelList);

myViewList.collection.fetch();

// DETAIL PANEL
let myDetailView = new EntityDetailView(new EntityModel());
myDetailView.reset();



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

console.time("insert");
jQuery(document).ready(function() {
    // Action after append is completely done
    console.timeEnd("insert");
});

