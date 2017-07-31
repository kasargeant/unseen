/**
 * @file Model.js
 * @description The Model class.
 * @author Kyle Alexis Sargeant <kasargeant@gmail.com> {@link https://github.com/kasargeant https://github.com/kasargeant}.
 * @copyright Kyle Alexis Sargeant 2017
 * @license See LICENSE file included in this distribution.
 */

"use strict";

// Imports
const Component = require("./Component");
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
class Model extends Component {
    /**
     * @param {string} idn - The id name of the component.
     * @param {Object} [record=null] - A data record object.
     * @param {Object} [options={}] - Instance options to override class/custom defaults.
     * @param {Object} [options.baseSchema={}] - An object representing the schema and default values of a data record.
     * @param {ModelList} [parent] - The parent (if any).
     * @param {number} [parentRef] - The parent's reference ID for this component (if any).
     * @constructor
     */
    constructor(idn, record = null, options = {}, parent = null, parentRef = 0) {

        // Call Component constructor
        super(idn, parent, parentRef);

        // Set by user (or default).
        this.defaults = {
            baseSchema: null,
            record: {},
            url: null
        };
        this.config = Object.assign(this.defaults, options);

        // Order of precedence is: Custom properties -then-> Instance options -then-> class defaults.
        this.baseSchema =  this.config.baseSchema || this.baseSchema;
        this.url = this.config.url || this.url;

        // Sanity check component construction requirements.
        if(!this.baseSchema) {
            throw new Error("Model requires a base Schema for structure and default values.");
        }

        // Set depending on previous internal/user properties.
        this._keys = null;
        this._data = {};
        this.urlLastUpdated = 0;

        // Initialise Model with Schema settings and assign data record values (if any).
        this._init(record || this.config.record);
    }

    /**
     * Add getters and setters - so that this can be treated 'as if' it were its contained data object.
     * @private
     */
    _init(data={}) {
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
                    this._data[key] = value || this.baseSchema[key];
                    this.emit("set", this._id);
                }
            });
            // Assign the property a value - or default value if none given.
            this._data[key] = data[key] || this.baseSchema[key];
        }
    }


    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // DATA METHODS
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    /**
     * Sets (resets) all valid key properties with the given value(s) - or defaults if no value(s) given.
     * @private
     */
    reset(data = {}) {
        // Set only schema keys and enforce defaults for any undefined or null data values.
        for(let key of this._keys) {
            // Assign the property a value - or default value if none given.
            this._data[key] = data[key] || this.baseSchema[key];
        }
        this.emit("reset");
    }

    /**
     * Gets all of the model's data properties or just a single property value - if a key is provided.
     * @param {string} [key] - Optional key.
     * @returns {*}
     */
    get(key) {
        return (key) ? this._data[key] : this._data;
    }

    /**
     * Sets one or more of a model's data properties. e.g. set({a: 10, b: "hi"});
     * @param {Object} data - The data properties to set.
     */
    set(key, value) {
        this._data[key] = value || this.baseSchema[key];
        this.emit("set", this._id);
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
        if(!this.url) {
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
        if(!this.url) {
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
