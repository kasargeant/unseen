/**
 * @file Controller.js
 * @description The Controller class.
 * @author Kyle Alexis Sargeant <kasargeant@gmail.com> {@link https://github.com/kasargeant https://github.com/kasargeant}.
 * @copyright Kyle Alexis Sargeant 2017
 * @license See LICENSE file included in this distribution.
 */

"use strict";

// Imports
const EventEmitter = require("event-emitter");
const jQuery = require("jquery");

/**
 * The Controller class.
 *
 * Responsibilities:-
 * * To store Views,
 * * To collect the rendering of all contained Views,
 * * To handle all related events.
 * @class
 */
class Controller {

    /**
     * @param {ModelList} modelCollection - An instantiated ModelList object.
     * @constructor
     */
    /**
     * @param {Array} views - An array of View and/or ViewList instances.
     * @param {Object} [options={}] - Instance options to override class/custom defaults.
     * @param {Controller} [parent] - The parent (if any).
     * @param {number} [parentRef] - The parent's reference ID for this component (if any).
     * @constructor
     */
    constructor(models = {}, views = {}, options = {}, parent = null, parentRef = null) {
        this.state = {};
        this.models = models;
        this.views = views;
    }

    addModel(key, model) {
        this.models[key] = model;
    }
    addView(key, view) {
        this.views[key] = view;
    }

    start() {
        for(let model in this.models) {
            console.log(`Starting model '${model}'.`);
            // this.models[model].fetch(credentials);
            this.models[model].fetch();
        }
    }
}

EventEmitter(Controller.prototype);

// Exports
module.exports = Controller;



