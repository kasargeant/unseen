/**
 * @file Model.js
 * @description The Model class.
 * @author Kyle Alexis Sargeant <kasargeant@gmail.com> {@link https://github.com/kasargeant https://github.com/kasargeant}.
 * @copyright Kyle Alexis Sargeant 2017
 * @license See LICENSE file included in this distribution.
 */

"use strict";

// Imports
const AbstractModel = require("./AbstractModel");

const fetchival = require("fetchival");
if(typeof window === "undefined") {
    fetchival.fetch = require("node-fetch");
}

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
 * @extends AbstractModel
 */
class Model extends AbstractModel {
    /**
     * @param {Object} data - A data record object.
     * @param {ModelCollection} [parent] - The parent (if any).
     * @param {number} [parentRef] - The parent's reference ID for this component (if any).
     * @constructor
     */
    constructor(data, options, parent, parentRef) {
        super(data, options, parent, parentRef);
        this.defaults.url = null;
    }

    /**
     * Fetches the model's data from a local or remote source.
     * @param {Function} callback
     */
    fetch(callback) {
        // Are we storing data locally - or proxying a backend?
        if(this.config.url === null) {
            // We're local... so we call the callback immediately.
            return callback(this);
        } else {
            // We're proxying... we call the callback on data receipt.
            this._rest("GET", {}, function(resData, textStatus, jqXHR) {
                console.log("RESPONSE: " + JSON.stringify(resData));
                // Load fresh data.
                this._reset(resData);

                // Fire any callback
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
        if(this.config.url === null) {
            // We're local... so we call the callback immediately.
            return callback(this);
        } else {
            // We're proxying...
            this._rest("PUT", data, function(resData, textStatus, jqXHR) {
                // Load fresh data.
                this._reset(resData);
                return callback(this);
            });
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
                fetchival(this.config.url).get(data).then(success);
                break;
            case "POST":
                fetchival(this.config.url).post(data).then(success);
                break;
            case "PUT":
                fetchival(this.config.url).put(data).then(success);
                break;
            case "DELETE":
                fetchival(this.config.url).delete(data).then(success);
                break;
            default:

        }
    }

}

// Exports
module.exports = Model;


// let myModel = new Model({"id": 123, "idn": "015695954", "type": "test", "name": "Test Street"});
// console.log(myModel.idn);