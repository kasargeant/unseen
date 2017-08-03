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
const Util = require("./Util");


const Model = require("./Model");

/**
 * The Component class.
 *
 * Responsibilities:-
 * * To hold a list of data models - equivalent to a database table.
 * @class
 */
class Component {

    /**
     * @param {Component} [parent] - The parent (if any).
     * @constructor
     */
    constructor(parent = null) {

        // Set by constructor.
        this._id = Component.prototype.UUID++;  // A unique component ID
        this._parent = parent;                  // The parent component (if any).

        // Set by user (or default).
        // Order of precedence is: Custom properties -then-> Instance options -then-> class defaults.
        this.initialize();      // Custom initialization.

        // Set depending on previous internal/user properties.
        this.lastUpdated = 0;


        // Adds internal events listener used by the Model to signal this Component on update.
        this.on("msg", function(sender, msg) {
            this.receive(sender, msg);
        }.bind(this));
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // USER LIFECYCLE METHODS
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    /**
     * A lifecycle method - called when the instance is first constructed.
     * @override
     */
    initialize() {}

    /**
     * A lifecycle method - called when the instance is about to be destroyed.
     * @override
     */
    finalize() {}

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // DATA METHODS
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    /**
     * Resets...
     * @override
     */
    reset(data) {}

    /**
     * Gets...
     * @override
     */
    get(key) {}

    /**
     * Sets...
     * @override
     */
    set(key, value) {}

    /**
     * Adds...
     * @override
     */
    add(key, value) {}

    /**
     * Removes...
     * @override
     */
    remove(key) {}

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // UTILITY METHODS
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    /**
     * Removes...
     * @override
     */
    toJSON() {
        if(this._parent !== null) {
            return `{"_id": ${this._id}, "parentId": ${this._parent._id}}`;
        } else {
            return `{"_id": ${this._id}}`;
        }
    }

    send(dst, msg) {
        dst.emit("msg", this, msg);
    }

    receive(src, msg) {
        console.log(`Component '${this._id}' received message: ${JSON.stringify(msg)} from: ${src.idn}`);
    }

    /**
     * Fetches the collection's data from a local or remote source.
     * @param {Function} callback
     */
    // fetch(url, method, success, failure) {
    fetch() {
        if(!this.url) {
            this.emit("refresh", this._id);
        } else {
            Util.fetch("GET", this.url, {}, function(resData) {
                console.log("RESPONSE: " + JSON.stringify(resData));
                this.reset(resData);
            }.bind(this));
        }
    }

    /**
     * Stores the collection's data to a local or remote source.
     * @param {Array} data
     * @param {Function} callback
     * @returns {*}
     */
    store(records) {

        // Prepare data - handling any missing/default values.
        let data = {};
        let i;
        for(i = 0; i < records.length; i++) {
            data[i] = new this.baseClass(records[i], this, i);
        }
        this.length = i;
        this._modelCounter = i; // This provides a unique ID for every model.

        // Are we storing data locally - or proxying a backend?
        if(!this.url) {
            // We're local...
            this.models = data;
        } else {
            // We're proxying...
            Util.fetch("POST", this.url, data, function(responseData) {
                this.models = responseData;
            });
        }
    }
}

Component.prototype.UUID = 0; // Define component counter on the class.

EventEmitter(Component.prototype);

// Exports
module.exports = Component;

//
// let comA = new Component("A");
// let comB = new Component("B");
// comB.emit("msg", comA, {idn:  comA.idn, msg: "la la la"});
// comA.send(comB, {idn:  comA.idn, msg: "la la la"});
// comB.send(comA, {idn:  comB.idn, msg: "la la la"});
//
// setTimeout(function(){ console.log("Done"); }, 3000);

