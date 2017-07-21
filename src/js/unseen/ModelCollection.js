/**
 * @file ModelCollection.js
 * @description The ModelCollection class.
 * @author Kyle Alexis Sargeant <kasargeant@gmail.com> {@link https://github.com/kasargeant https://github.com/kasargeant}.
 * @copyright Kyle Alexis Sargeant 2017
 * @license See LICENSE file included in this distribution.
 */

"use strict";

// Imports
const fetchival = require("fetchival");
if(typeof window === "undefined") {
    fetchival.fetch = require("node-fetch");
}

const AbstractModelCollection = require("./AbstractModelCollection");

/**
 * The ModelCollection class.
 *
 * Responsibilities:-
 * * TODO...
 * @class
 */
class ModelCollection extends AbstractModelCollection {

    /**
     * @param {Array} data - An array of data record objects.
     * @param {ModelCollection} [parent] - The parent (if any).
     * @param {number} [parentRef] - The parent's reference ID for this component (if any).
     * @constructor
     */
    constructor(data, parent, parentRef) {
        super(data, parent, parentRef);
    }

    fetch(callback) {
        // Are we storing data locally - or proxying a backend?
        if(this.url === null) {
            // We're local... we call the callback immediately.
            callback(this);
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
     *
     * @param {Array} records
     */
    store(data, callback) {
        // Are we storing data locally - or proxying a backend?
        if(this.url === null) {
            // We're local... so we call the callback immediately.
            return callback(this);
        } else {
            // We're proxying...
            this._rest("POST", data, function(resData, textStatus, jqXHR) {
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
    }

}

// Exports
module.exports = ModelCollection;


// let myModelCollection = new ModelCollection([
//     {"id": 123, "idn": "015695954", "type": "test", "name": "Test Street"},
//     {"id": 124, "idn": "040430544", "type": "test", "name": "Test Avenue"},
//     {"id": 125, "idn": "384894398", "type": "test", "name": "Test Lane"},
// ]);
// let myModel = myModelCollection.get(1);
// console.log(myModel.toString());