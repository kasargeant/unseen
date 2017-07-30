/**
 * @file Model.js
 * @description The Model class.
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

/**
 * The Util class.
 *
 * Responsibilities:-
 * * To provide core non-domain functionality to all components.
 *
 * Characteristics:-
 * * Static.
 * @class
 * @static
 */
class Util {

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
    static fetch(method="GET", url, data={}, success) {
        //
        // function(resData, textStatus, jqXHR) {
        //     console.log("RESPONSE: " + JSON.stringify(resData));
        //     // Fire any callback
        //     if(callback !== undefined) {
        //         callback(resData);
        //     }
        // }

        switch(method) {
            case "GET":
                fetchival(url).get(data).then(success);
                break;
            case "POST":
                fetchival(url).post(data).then(success);
                break;
            case "PUT":
                fetchival(url).put(data).then(success);
                break;
            case "DELETE":
                fetchival(url).delete(data).then(success);
                break;
            default:
        }
    }

    /**
     * Stores the model's data to a local or remote source.
     * @param {Object} data
     * @param {Function} callback
     * @returns {*}
     */
    static store(record) {

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
            this._rest("PUT", data, function(responseData, textStatus, jqXHR) {
                this._data = data;
            });
        }
    }

    static _restFailure(jqXHR, textStatus, errorThrown) {
        console.error(`Model Error: Failure to sync data with backend.  \n${errorThrown}`);
    }

    static _restSuccess() {

    }

    static _rest(method="GET", data=[], success) {
        console.log("Model: FETCHING!!!");

    }
}

// Exports
module.exports = Util;
