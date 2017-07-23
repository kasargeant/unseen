/**
 * @file SimpleSuper.js
 * @description The SimpleSuper class.
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

class SimpleSuper {

    constructor(url) {

        this.url = url;
    }

    /**
     * Fetches the model's data from a local or remote source.
     * @param {Function} callback
     */
    // fetch(callback) {
    //     this._rest("GET", {}, function(resData, textStatus, jqXHR) {
    //         //console.log("RESPONSE: " + JSON.stringify(resData));
    //         if(callback !== undefined) {
    //             return callback(resData);
    //         }
    //     }.bind(this));
    // }

    fetch(callback) {
        fetchival(this.url).get({}).then(function(resData, textStatus, jqXHR) {
            console.log("RESPONSE: " + JSON.stringify(resData));
            return callback(resData);
        });
    }

    /**
     * Stores the model's data to a local or remote source.
     * @param {Object} data
     * @param {Function} callback
     * @returns {*}
     */
    store(data, callback) {
        this._rest("PUT", data, function(resData, textStatus, jqXHR) {
            if(callback !== undefined) {
                return callback(resData);
            }
        }.bind(this));
    }

    _restFailure(jqXHR, textStatus, errorThrown) {
        console.error(`Model Error: Failure to sync data with backend.  \n${errorThrown}`);
    }

    _restSuccess() {

    }

    _rest(method="GET", data=[], success) {
        //console.log("Model: FETCHING!!!");
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

// // Exports
// module.exports = SimpleSuper;

class SimpleSub extends SimpleSuper {
    constructor(url) {
        super(url);
        this.result = "";
    }
    doShit() {
        console.log("Sub has url: " + this.url);
        this.fetch(function(data) {
            console.log("Sub callback has: " + JSON.stringify(data));
            this.result = data;
        }.bind(this));
    }
}



// let simpleSuper = new SimpleSuper("http://localhost:8080/article/1");
// simpleSuper.fetch(function(data) {
//     console.log(JSON.stringify(data));
// });

// let simpleSub = new SimpleSub("http://localhost:8080/article/2");
// simpleSub.fetch(function(data) {
//     // console.log(JSON.stringify(data));
//     this.result = data;
// }.bind(simpleSub));
// console.log("SUB RESULT = " + simpleSub.result);


let simpleSub = new SimpleSub("http://localhost:8080/article/2");
simpleSub.doShit();

let timeoutID = setTimeout(function() {
    console.log("SUB RESULT = " + JSON.stringify(simpleSub.result));

}, 4000);
