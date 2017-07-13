/**
 * @file index.js
 * @description Client index.
 * @license See LICENSE file included in this distribution.
 */
"use strict";

// Imports
const Backbone = require("backbone");
Backbone.$ = require("jquery");
Backbone._ = require("lodash");

const $ = require("jquery");

const PostCollection = require("./models/PostCollection");
const PostCollectionView = require("./views/PostCollectionView");
let rawData = require("../../data/processed_half.json");

$(document).ready(function() {


    this.postCollection = new PostCollection();
    // this.postCollection.set(rawData, {reset: true});
    this.postCollection.reset(rawData, {reset: true});
    this.postCollectionView = new PostCollectionView({collection: this.postCollection});
    console.time("render");
    this.postCollectionView.render();
    console.timeEnd("render");

    console.time("insert");
    Backbone.$("main").append(this.postCollectionView.el);
    Backbone.$(document).ready(function() {
        // Action after append is completely done
        console.timeEnd("insert");
    });
});


