/**
 * @file index.js
 * @description Module index.
 * @license See LICENSE file included in this distribution.
 */

"use strict";

// Imports
const Unseen = require("../../index");

const jQuery = require("jquery");

let rawData = require("../../../test/data/jest_results.json");

// console.log(JSON.stringify(Object.keys(rawData)));

// MODEL
// ["numFailedTestSuites","numFailedTests","numPassedTestSuites","numPassedTests","numPendingTestSuites","numPendingTests","numRuntimeErrorTestSuites","numTotalTestSuites","numTotalTests","snapshot","startTime","success","testResults","wasInterrupted","coverageMap"]
class ReportModel extends Unseen.Model {
    initialize() {
        this.baseSchema = {
            "numFailedTestSuites": 0,
            "numFailedTests": 0,
            "numPassedTestSuites": 0,
            "numPassedTests": 0,
            "numPendingTestSuites": 0,
            "numPendingTests": 0,
            "numRuntimeErrorTestSuites": 0,
            "numTotalTestSuites": 0,
            "numTotalTests": 0,
            "snapshot": {},
            "startTime": 0,
            "success": false,
            "testResults": [],
            "wasInterrupted": 0,
            "coverageMap": {}
        };
    }
}

let reportModel = new ReportModel(rawData);

// VIEW
class MyView extends Unseen.View {

    initialize() {
        this.base = reportModel;
        this.id = "my-item";
        this.tag = "div";
        this.classList = ["card"];
    }

    events() {
        return {
            "#button-delete": ["click", "deleteAction"]
        };
    }

    template(model, idx) {

        return `
            <div class="card-header">
            numFailedTestSuites: ${model.numFailedTestSuites}<br />
            numFailedTests: ${model.numFailedTests}<br />
            numPassedTestSuites: ${model.numPassedTestSuites}<br />
            numPassedTests: ${model.numPassedTests}<br />
            numPendingTestSuites: ${model.numPendingTestSuites}<br />
            numPendingTests: ${model.numPendingTests}<br />
            numRuntimeErrorTestSuites: ${model.numRuntimeErrorTestSuites}<br />
            numTotalTestSuites: ${model.numTotalTestSuites}<br />
            numTotalTests: ${model.numTotalTests}<br />
            </div>
        `;
    }
}

let myView = new MyView(reportModel);

console.time("render");

// myView._renderMarkup(true);
let markupResult = {html: ""};
myView._renderMarkup(false, markupResult);
console.log(markupResult.html);

console.timeEnd("render");

console.time("insert");
// jQuery(document).ready(function() {
//     // Action after append is completely done
//     console.timeEnd("insert");
// });



// // MODEL COLLECTION
// class MyModelCollection extends Unseen.ModelCollection {
//     initialize() {
//         this.baseClass = MyModel;
//     }
// }
//
// // VIEW
// class MyView extends Unseen.View {
//
//     initialize() {
//         this.base = null;
//         this.id = "my-item";
//         this.tag = "div";
//         this.classList = ["card"];
//     }
//
//     events() {
//         return {
//             "#button-delete": ["click", "deleteAction"]
//         };
//     }
//
//     template(model, idx) {
//
//         return `
//             <div class="card-header">
//                 <h4 class="card-title">${model.id}</h4>
//                 <h6 class="card-subtitle">${model.name}</h6>
//             </div>
//             <div class="card-body">
//                 ${model.id}: ${model.type} - ${model.name}
//             </div>
//             <div class="card-footer">
//                 <button id="button-delete" class="btn btn-primary">Delete</button>
//             </div>
//         `;
//     }
//
//     deleteAction(evt) {
//         console.log(`deleteAction for ${this._id} called by ${JSON.stringify(evt)}.`);
//         this.destroy();
//     }
// }
//
// // VIEW COLLECTION
// class MyViewCollection extends Unseen.ViewCollection {
//     initialize() {
//         this.baseClass = MyView;
//         this.id = "my-list";
//         this.tag = "div";
//         this.classList = ["container"];
//     }
// }
//
// // DEMO
//
// let myModelCollection = new MyModelCollection(rawData);
// let myViewCollection = new MyViewCollection(myModelCollection);
//
// console.log(`With ${myModelCollection.length} records.`);
// console.time("render");
//
// // myViewCollection._render(true);
// myViewCollection._renderMarkup(true);
//
// console.timeEnd("render");
//
// console.time("insert");
// jQuery(document).ready(function() {
//     // Action after append is completely done
//     console.timeEnd("insert");
// });
//
