"use strict";

// Imports
const slice = Array.prototype.slice;

module.exports = function(nodes, cb) {
    if(!("length" in nodes)) {
        nodes = [nodes];
    }

    nodes = slice.call(nodes);

    while(nodes.length) {
        let node = nodes.shift();
        let ret = cb(node);

        if(ret) {
            return ret;
        }

        if(node.childNodes && node.childNodes.length) {
            nodes = slice.call(node.childNodes).concat(nodes);
        }
    }
};
