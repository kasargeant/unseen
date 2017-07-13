"use strict";

// Imports
const Backbone = require("backbone");
Backbone.$ = require("jquery");
Backbone._ = require("lodash");

const PostModel = require("./PostModel");

// Component
const PostCollection = Backbone.Collection.extend({

    model: PostModel,

    initialize: function() {
        console.log("PostCollection: initialize()");
        this.on("add", function(model) {console.log("PostCollection: Adding model " + model.get("id"));});
        this.on("reset", function() {console.log("PostCollection: Reset collection.");});

    }
});

// Exports
module.exports = PostCollection;
