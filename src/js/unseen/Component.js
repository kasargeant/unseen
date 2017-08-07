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

/**
 * The Component class.
 *
 * Responsibilities:-
 * * Base class for all Models and Views.
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
     * Resets the data value or values.
     * @override
     */
    reset(data) {}

    /**
     * Gets a data value or values.
     * @override
     */
    get(key) {}

    /**
     * Sets a data value or values.
     * @override
     */
    set(key, value) {}

    /**
     * Adds a data value or values.
     * @override
     */
    add(key, value) {}

    /**
     * Removes a data value or values.
     * @override
     */
    remove(key) {}

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

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // UTILITY METHODS
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    /**
     * Sends a message to another component.
     * @override
     */
    send(dst, msg) {
        dst.emit("msg", this, msg);
    }

    /**
     * Receives messages from other components.
     * @override
     */
    receive(src, msg) {
        console.log(`Component '${this._id}' received message: ${JSON.stringify(msg)} from: ${src._id}`);
    }

    /**
     * Fetches data/settings from a remote datasource.
     * @override
     */
    fetch(key, value) {}

    /**
     * Stores data/settings in a remote datasource.
     * @override
     */
    store(key, value) {}

}

Component.prototype.UUID = 0; // Define component counter on the class.

EventEmitter(Component.prototype);

// Exports
module.exports = Component;

//
// let comA = new Component("A");
// let comB = new Component("B");
// comB.emit("msg", comA, {_id:  comA._id, msg: "la la la"});
// comA.send(comB, {_id:  comA._id, msg: "la la la"});
// comB.send(comA, {_id:  comB._id, msg: "la la la"});
//
// setTimeout(function(){ console.log("Done"); }, 3000);

