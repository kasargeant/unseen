"use strict";

// Imports
const Backbone = require("backbone");
Backbone.$ = require("jquery");
Backbone._ = require("lodash");

// Component
const PostView = Backbone.View.extend({
    tagName: "section",

    events: {
        "click .delete-post": "deletePost",
        "click .edit-post": "examinePost"
    },

    initialize: function() {
        console.log(`PostView(${this.model.get("id")}): initialize()`);
        this.listenTo(this.model, "change", this.render);
        this.listenTo(this.model, "destroy", this.remove);
    },
    template: Backbone._.template(`<div id="<%= id %>"><%= id %>: <%= type %> - <%= name %></div>`),

    // $el - it's a cached jQuery object (el), in which you can use jQuery functions to push content.
    render: function() {
        //console.log(`PostView(${this.model.get("id")}): render()`);
        let html = this.template(this.model.attributes);
        this.$el.html(html);
        return this;
    }
});

// Exports
module.exports = PostView;
