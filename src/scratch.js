const fs = require("fs");
const htmlparser = require("htmlparser2");

let htmlFile, htmlString, lhs, rhs;

// File 1
htmlFile = fs.readFileSync("demo.html");
htmlString = htmlFile.toString();
htmlString = htmlString.replace(/(<(pre|script|style|textarea)[^]+?<\/\2)|(^|>)\s+|\s+(?=<|$)/g, "$1$3");
lhs = htmlparser.parseDOM(htmlString);

// File 2
htmlFile = fs.readFileSync("demo2.html");
htmlString = htmlFile.toString();
htmlString = htmlString.replace(/(<(pre|script|style|textarea)[^]+?<\/\2)|(^|>)\s+|\s+(?=<|$)/g, "$1$3");
rhs = htmlparser.parseDOM(htmlString);

console.log(htmlString.split("><"));
// console.log(elements1);
// console.log(elements2);





// var diffDeep = require("deep-diff").diff;
// var differencesDeep = diffDeep(lhs, rhs);
// console.log(differencesDeep);

// // NATIVE
// const {diff, addedDiff, deletedDiff, detailedDiff, updatedDiff} = require("deep-object-diff");
// let differences = diff(lhs, rhs);
// console.log(differences);

// // LODASH BASED
// const diffLodash = require("object-deep-diff");
// let differencesLodash = diffLodash(lhs, rhs);
// console.log(differencesLodash);