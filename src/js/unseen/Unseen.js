// /**
//  * @file Unseen.js
//  * @description The Unseen class.
//  * @author Kyle Alexis Sargeant <kasargeant@gmail.com> {@link https://github.com/kasargeant https://github.com/kasargeant}.
//  * @copyright Kyle Alexis Sargeant 2017
//  * @license See LICENSE file included in this distribution.
//  */
//
// "use strict";
//
// // Imports
// const EventEmitter = require("event-emitter");
// const fetchival = require("fetchival");
// if(typeof window === "undefined") {
//     fetchival.fetch = require("node-fetch");
// }
//
//
// class Util {
//     restGet(url, data, success) {
//         fetchival(url).get(data).then(success);
//     }
//     restPut() {
//         fetchival(url).put(data).then(success);
//     }
//     restPost() {
//         fetchival(url).post(data).then(success);
//     }
//     restDelete() {
//         fetchival(url).delete(data).then(success);
//     }
// }
//
//
// class Schema {
//     constructor(name="", defaults={}, datasource=null) {
//         this.name = name;
//         this.defaults = defaults;
//         this.datasource = datasource;
//     }
// }
//
// class Model {
//     constructor(id=0, schema=new Schema()) {
//         this.name = name;
//         this.schema = schema;
//
//         if(this.schema.datasource !== null) {
//             // Fetch data async
//             Util.restGet(this.schema.datasource, )
//         }
//     }
// }
//
// class ModelList {
//     constructor(name="", schema=new Schema(), list=[]) {
//         this.name = name;
//         this.schema = schema;
//         this.list = list;
//     }
// }
//
// class ModelList {
//     constructor(name="", models=[]) {
//         this.name = name;
//         this.models = models;
//     }
// }
//
//
// /**
//  * The Unseen class.
//  *
//  * Responsibilities:-
//  * * To hold a list of data models - equivalent to a database table.
//  * @class
//  * @extends Component
//  */
// class Unseen {
//     constructor() {
//         this.metadata = {}; // Stores all Model list and object metadata
//         this.data = {}; // Stores all Model lists
//     }
//     makeSchema() {
//
//     }
//
//     makeModel(options) {
//
//
//
//         return class Model {
//             constructor(id=0, schema=new Schema()) {
//                 this.name = name;
//                 this.schema = schema;
//
//                 if(this.schema.datasource !== null) {
//                     // Fetch data async
//                     Util.restGet(this.schema.datasource, )
//                 }
//             }
//         }
//     }
//
//     makeModelList(options) {
//
//     }
//
//     makeView(options) {
//
//     }
//
//     makeTemplate(options) {
//
//     }
// }
//
// class Schema {
//
// }
//
// class Model {
//
// }