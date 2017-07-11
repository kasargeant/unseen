/**
 * @file View.js
 * @description The View class.
 * @author Kyle Alexis Sargeant <kasargeant@gmail.com> {@link https://github.com/kasargeant https://github.com/kasargeant}.
 * @copyright Kyle Alexis Sargeant 2017
 * @license See LICENSE file included in this distribution.
 */

"use strict";

class View {
    constructor(model, template, parent) {
        this.model = model;
        this.template = template;
        this.parent = parent;
        this.el = "";
        this.fragment = null;
    }

    render() {
        this.el = this.template(this.model);
    }

}

// Exports
module.exports = View;
