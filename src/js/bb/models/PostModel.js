"use strict";

// Imports
const Backbone = require("backbone");
Backbone.$ = require("jquery");
Backbone._ = require("lodash");

// Component
const PostModel = Backbone.Model.extend({
    // urlRoot: "/article",
    defaults: {"id": 0, "idn": "unnamed", "class": "unknown", "type": "unknown", "name": "Unnamed"}
});

// Exports
module.exports = PostModel;
