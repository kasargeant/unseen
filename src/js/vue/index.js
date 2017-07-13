/**
 * @file index.js
 * @description Client index.
 * @license See LICENSE file included in this distribution.
 */
"use strict";

// Imports
const Vue = require("vue");
const jQuery = require("jquery");
let rawData = require("../../data/processed_half.json");

Vue.component("article-post", {
    props: ["post"],
    template: `<div id="idx-">{{ post.id }}: {{ post.type }} - {{ post.name }}</div>`
});

console.time("render");
new Vue({
    // Remember: Vue converts all properties to getters/setters
    el: "#app",
    created: function() {
        // app.postList = rawData;
        console.timeEnd("render");
        console.time("insert");
    },
    // Remember: Vue needs all data keys upfront!  It can't detect additions or removals later.
    data: {
        postList: rawData
    }
});
jQuery(document).ready(function() {
    // Action after append is completely done
    console.timeEnd("insert");
});
