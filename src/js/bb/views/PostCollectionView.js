"use strict";

// Imports
const Backbone = require("backbone");
Backbone.$ = require("jquery");
Backbone._ = require("lodash");

const PostCollectionViewItem = require("./PostCollectionViewItem");

// Component
const PostCollectionView = Backbone.View.extend({

    tagName: "section",

    initialize: function() {
        console.log("PostCollectionView: initialize()");
        this.listenTo(this.collection, "add", this.addOne);
        this.listenTo(this.collection, "reset", this.addAll);
        this.listenTo(this.collection, "change", this.render);
        // this.listenTo(this.collection, "destroy", this.remove);
    },

    addAll: function() {
        //console.log("PostCollectionView: addAll()");
        this.collection.forEach(this.addOne, this);
    },

    addOne: function(postModel) {
        //console.log("PostCollectionView: addOne()");
        let postViewItem = new PostCollectionViewItem({model: postModel});
        this.$el.append(postViewItem.render().el);
    },

    render: function() {
        //console.log("PostCollectionView: render()");
        this.addAll();
    }
});

// Exports
module.exports = PostCollectionView;
