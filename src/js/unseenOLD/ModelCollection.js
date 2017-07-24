/**
 * @file ModelCollection.js
 * @description The ModelCollection class.
 * @author Kyle Alexis Sargeant <kasargeant@gmail.com> {@link https://github.com/kasargeant https://github.com/kasargeant}.
 * @copyright Kyle Alexis Sargeant 2017
 * @license See LICENSE file included in this distribution.
 */

"use strict";

// Imports
const Component = require("./Component");
const Model = require("./Model");

/**
 * The ModelCollection class.
 *
 * Responsibilities:-
 * * To hold a list of data models - equivalent to a database table.
 * @class
 * @extends Component
 */
class ModelCollection extends Component {

    /**
     * @param {Array} data - An array of data record objects.
     * @param {Object} [options] - Component configuration options.
     * @param {Component} [parent] - The parent (if any).
     * @param {number} [parentRef] - The parent's reference ID for this component (if any).
     * @constructor
     */
    constructor(data = [], options = {}, parent = null, parentRef = null) {

        // Specialized component defaults
        let defaults = {
            schema: null
        };
        super(defaults, options, parent, parentRef);

        // Specialized component properties.
        this.models = null;
        this.length = 0;

        this.lastFetched = null;

        if(this.url !== null) {
            if(this.lastFetched === null) {
                this.fetch(function(resData) {
                    this.lastFetched = new Date().getTime();
                    this.reset(resData);// Add accessors (after data call success).
                }.bind(this));
            } else {
                // Fire a ghost 'reset' event.
                this._emit("reset");
            }
        } else {
            this.reset(data);       // Add accessors.
        }

        // Adds internal events listener used by the Model to signal this ModelCollection on update.
        this.on("set", function(args) {
            console.log(`ModelCollection #${this._id}: Model #${args} changed.`);
            this._emit("set"); // Relay the event forward
        });

        this.on("view-remove", function(args) {
            console.log(`ModelCollection #${this._id}: View #${args} changed.`);
            console.log(`ModelCollection #${this._id}: Removing Model #${args}`);
            console.log("exists? " + (this.models[args] !== undefined));
            delete this.models[args];
            console.log("exists? " + (this.models[args] !== undefined));
            this._emit("remove"); // Relay the event forward
        });
    }

    /**
     * Add getters and setters - so that this can be treated 'as if' it were its contained data object.
     * @private
     */
    reset(data) {
        // Initialise collection's contents.
        this.models = {};

        // Instantiate ModelCollection's contents
        for(let id = 0; id < data.length; id++) {
            // Instantiate new model and set private properties.
            // this.models[id] = new Model(data[id], this, id);
            this.models[id] = new Model(data[id], {
                schema: this.config.schema,
                url: ((this.url !== null) ? `${this.url}/${id}` : null)
            }, this, id);
        }
        this.length = data.length;

        // Inform parent (if any).
        this.emit("reset");
    }

    get(id) {
        if(id === undefined) {
            return this.models;
        } else {
            return this.models[id];
        }
    }

    set(data) {
        if(Array.isArray(data)) {
            this.models = {};
            let i;
            for(i = 0; i < data.length; i++) {
                this.models[i] = new this.baseClass(data[i], this, i);
            }
            this.length = i;
            this._modelCounter = i; // This provides a unique ID for every model.
        } else {
            throw new Error("ModelCollection Error: Attempt to set without using a data array.");
        }

        // Inform parent (if any).
        this.emit("set");
    }

    add(record) {
        let id = this._modelCounter++;
        this.models[id] = new this.baseClass(record, this, id);
        this.length++;

        // Inform parent (if any).
        this.emit("add");
    }

    toString() {
        for(let id in this.models) {
            console.log(this.models[id]._dump());
        }
    }
}

// Exports
module.exports = ModelCollection;

// // CHECK - LOCAL
// let myModelCollection = new ModelCollection([
//     {"id": 123, "idn": "015695954", "type": "test", "name": "Test Street"},
//     {"id": 124, "idn": "040430544", "type": "test", "name": "Test Avenue"},
//     {"id": 125, "idn": "384894398", "type": "test", "name": "Test Lane"},
// ]);
// let myModel = myModelCollection.get(1);
// console.log(myModel.toString());


// // CHECK - REST
// let myModelCollection = new ModelCollection([], {
//     url: "http://localhost:8080/article"
// });
// myModelCollection.on("reset", function() {
//     let myModel = myModelCollection.get(1);
//     console.log(myModel.toString());
// });
