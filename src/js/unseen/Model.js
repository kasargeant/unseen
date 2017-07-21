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
 */
class Model extends AbstractModel {
    /**
     * @param {Object} data - A data record object.
     * @constructor
     */
    constructor(data, parent, parentRef) {
        super(data, parent, parentRef);
    }

    fetch(callback) {
        // Are we storing data locally - or proxying a backend?
        if(this.url === null) {
            // We're local... so we call the callback immediately.
            return callback(this);
        } else {
            // We're proxying... we call the callback on data receipt.
            this._rest("GET", {}, function(resData, textStatus, jqXHR) {
                console.log("RESPONSE: " + JSON.stringify(resData));
                // Prepare data - handling any missing/default values.
                this._reset(resData);  // Add accessors.

                // Fire any callback
                if(callback !== undefined) {
                    return callback(this);
                }
            }.bind(this));
        }
    }

    store(data, callback) {
        // Are we storing data locally - or proxying a backend?
        if(this.url === null) {
            // We're local... so we call the callback immediately.
            return callback(this);
        } else {
            // We're proxying...
            this._rest("PUT", data, function(resData, textStatus, jqXHR) {
                this._data = resData;
                this._resetKeys();  // Add accessors.
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

// Exports
module.exports = Model;