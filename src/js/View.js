/**
 * @file View.js
 * @description The View class.
 * @author Kyle Alexis Sargeant <kasargeant@gmail.com> {@link https://github.com/kasargeant https://github.com/kasargeant}.
 * @copyright Kyle Alexis Sargeant 2017
 * @license See LICENSE file included in this distribution.
 */

"use strict";

class View {
    constructor(model, parent=null) {

        this.parent = parent;

        this.target = "main";
        this.tag = "section";

        this.model = model;
        this.el = "";

        this.subViews = null;
        this.fragment = null;
    }

    template(model, params) {return JSON.stringify(model);}

    render() {
        if(this.subViews === null) {
            this.el = this.template(this.model);
        } else {
            for(let i = 0; i < this.subViews.length; i++) {
                this.el += this.subViews.render();
            }
        }
        return this.el;
    }

}

// Exports
module.exports = View;
