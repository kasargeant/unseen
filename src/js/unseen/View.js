/**
 * @file View.js
 * @description The View class.
 * @author Kyle Alexis Sargeant <kasargeant@gmail.com> {@link https://github.com/kasargeant https://github.com/kasargeant}.
 * @copyright Kyle Alexis Sargeant 2017
 * @license See LICENSE file included in this distribution.
 */

"use strict";

// Imports
const EventEmitter = require("event-emitter");
const jQuery = require("jquery");
const walk = require("./walk");

class View {
    constructor(model, parent=null, id=0) {

        this._parent = parent;
        this._id = id;

        this.target = "main";
        this.tag = "section";

        this.model = model;
        //this.model._parent = this;

        this.el = "";

        this.subViews = null;
        this.fragment = null;

        this.on("change", function(args) {
            console.log(`View #${this._id}: Model/Collection #${args} changed.`);
            this._emit("change"); // Relay the event forward
        });

        this.initialize(); // User initialization.
    }

    // LIFECYCLE METHODS
    initialize() {
        // Lifecycle method.
    }
    destroy() {}

    // return [
    //    ["button-delete", "click", "deleteAction"]
    // ];
    events() {return null;}

    _emit(eventType) {
        if(this._parent !== null) {
            this._parent.emit(eventType, this._id);
        }
    }

    template(model, params) {return JSON.stringify(model);}

    render(doInsert=false, id="") {
        // Render view for single model
        this.el = `<${this.tag} id="view-${this._id}">`;
        this.el += this.template(this.model, id);
        this.el += "</" + this.tag + ">";
        if(doInsert === true) {
            jQuery(this.target).append(this.el);
        } else {
            return this.el;
        }
    }

    renderTree(doInsert=false) {
        // Render view for single model
        this.el = document.createElement(this.tag);
        for(let i = 0; i < this.model.length; i++) {
            let model = this.model.get(i); // Note if the 'model' IS a single model... it returns itself
            this.el.appendChild(this.template(model, i));
        }
        if(doInsert === true) {
            jQuery(this.target).append(this.el);
        } else {
            return this.el;
        }
    }

    renderFragment(doInsert=false, fragment=null) {
        // Are we a top-level view?
        if(fragment === null && this._parent === null) {
            // YES - without passed fragment or parent
            fragment = document.createDocumentFragment();
        }
        let element = document.createElement(this.tag);
        element.id = `view-${this._id}`;
        element.innerHTML = this.template(this.model, 0);

        // First we make any element ids in this View - unique.
        walk(element, function(node) {
            // console.log("node", node); // DEBUG ONLY
            if(node.id !== null) {
                node.id = node.id + "-" + this._id;
            }
        }.bind(this));


        fragment.appendChild(element);


        if(doInsert === true) {
            jQuery(this.target).append(fragment);
        }
        return this.events();
    }
}

EventEmitter(View.prototype);

// Exports
module.exports = View;



