/**
 * @file ModelCollection.js
 * @description The ModelCollection class.
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
 * The ModelCollection class.
 *
 * Responsibilities:-
 * * TODO...
 * @class
 */
class ModelCollection {

    /**
     * @param {Array} records - A data array to initially populate this ModelCollection.
     * @constructor
     */
    constructor(records = []) {

        // Set internally (or by parent).
        this._parent = null;    // The parent component (if any).
        this._id = 0;           // The parent's reference ID for this component (if any).

        // Set by user (or default).
        this.baseClass = null;
        this.url = null;
        this.lastUpdated = 0;
        this.initialize();      // LIFECYCLE CALL: INITIALIZE

        // Sanity check user initialization.
        if(this.baseClass === null) {
            throw new Error("ModelCollection requires a base Model class.");
        }

        // Set depending on previous internal/user properties.
        this.models = {};
        this.length = 0;

        // Instantiate ModelCollection's contents
        let id;
        for(id = 0; id < records.length; id++) {
            // Instantiate new model and set private properties.
            this.models[id] = new this.baseClass(records[id]);
            this.models[id]._parent = this;
            this.models[id]._id = id;
            this.models[id].url = `${this.url}/${id}`;
        }
        this.length = id;
        this._modelCounter = id; // This provides a unique ID for every model.

        // Adds internal events listener used by the Model to signal this ModelCollection on update.
        this.on("change", function(args) {
            console.log(`ModelCollection #${this._id}: Model #${args} changed.`);
            this._emit("change"); // Relay the event forward
        });

        this.on("view-remove", function(args) {
            console.log(`ModelCollection #${this._id}: View #${args} changed.`);
            console.log(`ModelCollection #${this._id}: Removing Model #${args}`);
            console.log("exists? " + (this.models[args] !== undefined));
            delete this.models[args];
            console.log("exists? " + (this.models[args] !== undefined));
            this._emit("change"); // Relay the event forward
        });
    }
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // LIFECYCLE METHODS
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    /**
     * @override
     */
    initialize() {}

    /**
     * @override
     */
    finalize() {}

    _emit(eventType) {
        if(this._parent !== null) {
            // this._parent.dispatchEvent(eventType);
            this._parent.emit(eventType, this._id);
        }
    }

    reset() {
        this.models = {};
    }

    get(id) {
        return this.models[id];
    }

    set(records) {
        if(Array.isArray(records)) {
            this.models = {};
            let i;
            for(i = 0; i < records.length; i++) {
                this.models[i] = new this.baseClass(records[i], this, i);
            }
            this.length = i;
            this._modelCounter = i; // This provides a unique ID for every model.
        } else {
            throw new Error("ModelCollection Error: Attempt to set without using a data array.");
        }
    }

    fetch(callback) {
        // Are we storing data locally - or proxying a backend?
        if(this.url === null) {
            // We're local... we call the callback immediately.
            callback(this.models);
        } else {
            // We're proxying... we call the callback on data receipt.
            this._rest("GET", {}, function(responseData, textStatus, jqXHR) {
                console.log("RESPONSE: " + JSON.stringify(responseData));

                // Prepare data - handling any missing/default values.
                this.models = {};
                this.length = 0;

                let records = responseData;
                let id;
                for(id = 0; id < records.length; id++) {
                    // Instantiate new model and set private properties.
                    this.models[id] = new this.baseClass(records[id]);
                    this.models[id]._parent = this;
                    this.models[id]._id = id;
                }
                this.length = id;

                // Fire any callback
                if(callback !== undefined) {
                    callback(this.models);
                }
            }.bind(this));
        }
    }

    /**
     *
     * @param {Array} records
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
        if(this.url === null) {
            // We're local...
            this.models = data;
        } else {
            // We're proxying...
            this._rest("POST", data, function(responseData, textStatus, jqXHR) {
                this.models = responseData;
            });
        }
    }

    _restFailure(jqXHR, textStatus, errorThrown) {
        console.error(`Model Error: Failure to sync data with backend.  \n${errorThrown}`);
    }

    _restSuccess() {

    }

    _rest(method="GET", data=[], success) {
        console.log("ModelCollection: FETCHING!!!");
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
        // jQuery.ajax({
        //     type: method,
        //     url: this.url,
        //     data: data,
        //     error: this._restFailure,
        //     success: success,
        //     dataType: "json"
        // });
    }


    add(record) {
        let id = this._modelCounter++;
        this.models[id] = new this.baseClass(record, this, id);
        this.length++;
    }

    toString() {
        for(let id in this.models) {
            console.log(this.models[id]._dump());
        }
    }

}

EventEmitter(ModelCollection.prototype);

// Exports
module.exports = ModelCollection;
