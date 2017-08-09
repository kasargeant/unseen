/**
 * @file index.js
 * @description Module index.
 * @license See LICENSE file included in this distribution.
 */

"use strict";

// Imports
const Unseen = require("../unseen/Unseen");

const EntityModel = require("./model/EntityModel");
const EntityModelList = require("./model/EntityModelList");
const EntityNavModel = require("./model/EntityNavModel");

const EntityListViewList = require("./view/EntityViewList");
const EntityNavView = require("./view/EntityNavView");
const EntityMenuView = require("./view/EntityMenuView");
const EntityDetailView = require("./view/EntityDetailView");

const jQuery = require("jquery"); // NOTE: jQuery used only during benchmarking.

// TEST DATA
let rawData = require("../../data/processed_sample.json");

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
    title: "Contents",
    items: {
        "About": "#",
        "Docs": "https://kasargeant.github.io/unseen/api/",
        "Components": {
            "Model": "https://kasargeant.github.io/unseen/api/Model.html",
            "View": "https://kasargeant.github.io/unseen/api/View.html"
        },
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


// DEMO: BROWSER
console.log(`Testing with ${myModelList.length} records.`);
console.time("insert");
jQuery(document).ready(function() {
    // Action after append is completely done
    console.timeEnd("insert");
});
