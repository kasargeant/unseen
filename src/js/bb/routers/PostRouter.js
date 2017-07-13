"use strict";

// Imports
const Backbone = require("backbone");
Backbone.$ = require("jquery");
Backbone._ = require("lodash");

const PostCollection = require("../models/PostCollection");
const PostCollectionView = require("../views/PostCollectionView");
let rawData = require("../../data/processed_sample.json");

let postCollection = new PostCollection();
postCollection.reset(rawData, {reset: true});
let postCollectionView = new PostCollectionView({collection: postCollection});
Backbone.$("main").append(postCollectionView.el);


// Component
const PostRouter = Backbone.Router.extend({
    routes: {
        "": "indexScreen",
        "post/:id": "postScreen"
    },
    initialize: function() {
        console.log("PostRouter: initialize()");

    },
    start: function() {
        console.log("PostRouter: start()");
        // Backbone.history.start({pushState: true});
        Backbone.history.start();
    },
    indexScreen: function() {
        console.log("PostRouter: index()");

        // Backbone.$("#posts").empty();
        // Backbone.$("#posts").append(this.postCollectionView.el);

        Backbone.$("main").children().first().detach();
        Backbone.$("main").append(this.postCollectionView.el);

        //this.$el.html(this.postCollectionView.el);
    }
});

// Exports
module.exports = PostRouter;
