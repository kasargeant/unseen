/**
 * @file Component.js
 * @description The Component class.
 * @author Kyle Alexis Sargeant <kasargeant@gmail.com> {@link https://github.com/kasargeant https://github.com/kasargeant}.
 * @copyright Kyle Alexis Sargeant 2017
 * @license See LICENSE file included in this distribution.
 */

"use strict";

// Imports
const EventEmitter = require("event-emitter");
const fetchival = require("fetchival");
if(typeof window === "undefined") {
    fetchival.fetch = require("node-fetch");
}

/**
 * The Component class.
 *
 * NOTE: ALWAYS USE CLASSES DERIVED FROM THIS ABSTRACT.  IT IS NOT ADVISED TO USE THIS DIRECTLY.
 * @class
 * @abstract
 */
class Component {
    /**
     * @param {Object} [defaults] - Component defaults (supplied by derived concrete class).
     * @param {Object} [options] - Component configuration options.
     * @param {string} [options.language=es51] - JavaScript language version.  Can be "es51", "es2015".
     * @param {Component} [parent] - The parent (if any).
     * @param {number} [parentRef] - The parent's reference ID for this component (if any).
     * @constructor
     */
    constructor(defaults = {}, options = {}, parent = null, parentRef = 0) {

        this.config = Object.assign(defaults, options);
        // console.log("Component config: " + JSON.stringify(this.config));

        // Set internally (or by parent).
        this._parent = parent;  // The parent component (if any).
        this._id = parentRef;   // The parent's reference ID for this component (if any).
        this.url = (this.config.url === undefined) ? null : this.config.url;

        // Set by user (or default).
        this.initialize();  // LIFECYCLE CALL: INITIALIZE
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // LIFECYCLE: USER-DEFINED
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    /**
     * A lifecycle method - called when the instance is first constructed.
     * @override
     */
    initialize() {
        console.log("SUPER INIT");
    }

    /**
     * A lifecycle method - called when the instance is about to be destroyed.
     * @override
     */
    finalize() {}

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // CROSS-COMPONENT UTILITIES
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    /**
     * Fetches the model's data from a local or remote source.
     * @param {Function} callback
     */
    fetch(callback) {
        // Are we storing data locally - or proxying a backend?
        if(this.url === null) {
            // We're local... so we call the callback immediately.
            if(callback !== undefined) {
                return callback(this);
            }
        } else {
            // We're proxying... we call the callback on data receipt.
            this._rest("GET", {}, function(resData, textStatus, jqXHR) {
                console.log("RESPONSE: " + JSON.stringify(resData));
                if(callback !== undefined) {
                    return callback(this);
                }
            }.bind(this));
        }
    }

    /**
     * Stores the model's data to a local or remote source.
     * @param {Object} data
     * @param {Function} callback
     * @returns {*}
     */
    store(data, callback) {
        // Are we storing data locally - or proxying a backend?
        if(this.url === null) {
            // We're local... so we call the callback immediately.
            if(callback !== undefined) {
                return callback(this);
            }
        } else {
            // We're proxying...
            this._rest("PUT", data, function(resData, textStatus, jqXHR) {
                if(callback !== undefined) {
                    return callback(this);
                }
            }.bind(this));
        }
    }

    _restFailure(jqXHR, textStatus, errorThrown) {
        console.error(`Model Error: Failure to sync data with backend.  \n${errorThrown}`);
    }

    _restSuccess() {

    }

    _rest(method="GET", data=[], success) {
        console.log("Model: FETCHING!!!");
        switch(method) {
            case "GET":
                fetchival(this.url).get(data).then(success);
                break;
            case "POST":
                fetchival(this.url).post(data).then(success);
                break;
            case "PUT":
                fetchival(this.url).put(data).then(success);
                break;
            case "DELETE":
                fetchival(this.url).delete(data).then(success);
                break;
            default:

        }
    }
}

EventEmitter(Component.prototype);

// Exports
module.exports = Component;
