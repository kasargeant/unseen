/**
 * @file Model.js
 * @description The Model class.
 * @author Kyle Alexis Sargeant <kasargeant@gmail.com> {@link https://github.com/kasargeant https://github.com/kasargeant}.
 * @copyright Kyle Alexis Sargeant 2017
 * @license See LICENSE file included in this distribution.
 */

"use strict";

// Imports
const EventEmitter = require("event-emitter");
const Util = require("./Util");

/**
 * The Model class.
 *
 * Responsibilities:-
 * * To hold a set of data attributes - equivalent to a database record.
 *
 * Characteristics:-
 * * To be accessible 'as if' it were a simple key-value object.
 * * To optionally validate data.
 * @class
 */
class Model {
    /**
     * @param {Object} [record=null] - A data record object.
     * @param {Object} [options={}] - Instance options to override class/custom defaults.
     * @param {Object} [options.baseSchema={}] - An object representing the schema and default values of a data record.
     * @param {ModelList} [parent] - The parent (if any).
     * @param {number} [parentRef] - The parent's reference ID for this component (if any).
     * @constructor
     */
    constructor(record = null, options = {}, parent = null, parentRef = 0) {

        // Component defaults
        this.defaults = {
            baseSchema: null,
            record: {},
            url: null
        };

        // Set internally (or by parent).
        this._parent = parent;  // The parent component (if any).
        this._id = parentRef;   // The parent's reference ID for this component (if any).

        // Set by user (or default).
        // Order of precedence is: Custom properties -then-> Instance options -then-> class defaults.
        this.initialize();      // Custom initialization.
        this.baseSchema = options.baseSchema || this.baseSchema || this.defaults.baseSchema;
        this.url = options.url || this.url || this.defaults.url;

        this.lastUpdated = 0;

        // Set depending on previous internal/user properties.
        this._keys = null;
        this._data = {};
        let data = record || options.record || this.defaults.record;
        if(this.baseSchema === null) {
            this._data = data;
        } else {
            this.reset(this.baseSchema, data);
        }
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // USER LIFECYCLE METHODS
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    /**
     * A lifecycle method - called when the instance is first constructed.
     * @override
     */
    initialize() {}

    // /**
    //  * A lifecycle method - called when the instance is about to be destroyed.
    //  * @override
    //  */
    // finalize() {}

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // DATA METHODS
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    /**
     * Add getters and setters - so that this can be treated 'as if' it were its contained data object.
     * @private
     */
    reset(baseSchema = null, data = {}) {

        // First we delete any previously defined key accessors (if any).
        if(this._keys !== null) {
            for(let key of this._keys) {
                delete this[key];
            }
        }

        // Do we have a schema?
        if(baseSchema === null) {
            // NO: then simply assign the data.
            this._data = data;
        } else {
            // YES: Then...
            // Set the new schema.
            this.baseSchema = baseSchema;

            // Set the new keys
            this._keys = Object.keys(this.baseSchema);

            // Set new key accessors on model...
            // ...allow only schema keys and enforce defaults for any undefined or null data values.
            for(let key of this._keys) {
                // Define getters and setters for each schema property
                Object.defineProperty(this, key, {
                    /**
                     * Getter for an individual model data property. e.g. console.log(myModel.myProp);
                     */
                    get: function() {
                        return this._data[key];
                    },
                    /**
                     * Setter for an individual model data property. e.g. myModel.myProp = 10;
                     * @param {Object} value - The value to set this data property
                     */
                    set: function(value) {
                        // Assign new value - or default value if none given.
                        this._data[key] = value;
                        this.emit("set", this._id);
                    }
                });
                // Assign the property a value - or default value if none given.
                this._data[key] = data[key] || this.baseSchema[key];
            }
        }
    }

    /**
     * Gets the model's data properties.
     */
    get() {
        return this._data;
    }

    /**
     * Sets one or more of a model's data properties. e.g. set({a: 10, b: "hi"});
     * @param {Object} data - The data properties to set.
     */
    set(data) {
        if(this.baseSchema === null) {
            this.data = data;
        } else {
            for(let key of this._keys) {
                if(this.baseSchema[key] !== undefined) {
                    // Then assign the property a value - or default value if none given.
                    this._data[key] = data[key] || this.baseSchema[key];
                }
                this.emit("set", this._id);
            }
        }
    }


    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // UTILITY METHODS
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    toJSON() {
        return JSON.stringify(this._data);
    }

    /**
     * Fetches the model's data from a local or remote source.
     * @param {Function} callback
     */
    fetch() {
        // Are we storing data locally - or proxying a backend?
        if(this.url === null) {
            // We're local... we call the callback immediately.
            this.emit("change", this._id); // Faux event.
        } else {
            // We're proxying... we call the callback on data receipt.
            Util.fetch("GET", this.url, {}, function(resData) {
                for(let key of this._keys) {
                    // Then assign the property a value - or reassign if none given. // TODO optimise this!
                    this._data[key] = resData[key] || this.baseSchema[key];
                }
                this.emit("change", this._id);
            }.bind(this));
        }
    }

    /**
     * Stores the model's data to a local or remote source.
     * @param {Object} data
     * @param {Function} callback
     * @returns {*}
     */
    store(record) {

        // Prepare data - handling any missing/default values.
        let data = {};
        for(let key of this._keys) {
            // Then assign the property a value - or reassign if none given. // TODO optimise this!
            data = record[key] || this._data[key];
        }

        // Are we storing data locally - or proxying a backend?
        if(this.url === null) {
            // We're local...
            this._data = data;
        } else {
            // We're proxying...
            Util.fetch("PUT", data, function(resData) {
                this._data = data;
            });
        }
    }

}

EventEmitter(Model.prototype);

// Exports
module.exports = Model;


// // REST TEST
// const schema = {"id": 0, "idn": "unnamed", "class": "unknown", "type": "unknown", "name": "Unnamed"};
//
// class MyModel extends Model {
//     initialize() {
//         this.baseSchema = schema;
//         this.url = "http://localhost:8080/entity/1";
//     }
// }
//
//
// let myModel = new MyModel();
// myModel.on("change", function() {
//     console.log(this.toJSON());
// }.bind(myModel));
// myModel.fetch();
