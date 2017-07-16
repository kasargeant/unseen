/**
 * @file BaseView.js
 * @description The Base View class.
 * @author Kyle Alexis Sargeant <kasargeant@gmail.com> {@link https://github.com/kasargeant https://github.com/kasargeant}.
 * @copyright Kyle Alexis Sargeant 2017
 * @license See LICENSE file included in this distribution.
 */

"use strict";

// Imports
const EventEmitter = require("event-emitter");
const jQuery = require("jquery");
const walk = require("./walk");

/**
 * The base View class.
 * @class
 */
class BaseView {
    /**
     * @param base
     * @param parent
     * @param id
     * @constructor
     */
    constructor(base, parent=null, id=0) {

        // Set internally (or by parent).
        this._parent = parent;
        this._id = id;          // View ID

        // Set by user (or default).
        this.base = base;
        this.id = "view";       // HTML Element ID
        this.target = "main";
        this.tag = "div";
        this.classList = [];
        this.initialize();  // LIFECYCLE CALL: INITIALIZE

        // Calculated from previous internal/user properties.
        this.views = null;
        this.el = "";

        // Adds internal events listener used by the ModelCollection to signal this ViewCollection on update.
        this.on("change", function(args) {
            console.log(`BaseView #${this._id}: Model/Collection #${args} changed.`);
            this._emit("change"); // Relay the event forward
        });
    }

    // LIFECYCLE METHODS

    /**
     * @override
     */
    initialize() {
        // Lifecycle method.
    }

    /**
     * @override
     */
    finalize() {

    }

    destroy() {
        let selector = `#${this.id}-${this._id}`;
        console.log("SELECTOR" + selector);
        console.log(`BaseView ${this._id} is being destroyed!!!`);
        jQuery(selector).remove();
    }

    // return [
    //    ["#button-delete", "click", "deleteAction"]
    // ];
    events() {return null;}

    _emit(eventType) {
        if(this._parent !== null) {
            this._parent.emit(eventType, this._id);
        }
    }

    template(model, params) {return JSON.stringify(model);}

    style() {
        return "";
    }

    _render(doInsert=false, fragment=null) {

        let element = document.createElement(this.tag);
        element.id = this.id;
        element.classList.add(this.id); // We add the id as a class because here - it will not be mutated/mangled.
        element.classList.add(...this.classList); // We add any remaining classes.
        element.innerHTML = this.template(this.base, this._id);
        // First we make any element ids in this View - unique.
        walk(element, function(node) {
            // console.log("node", node); // DEBUG ONLY
            if(node.id !== null) {
                node.id = node.id + "-" + this._id;
            }
        }.bind(this));

        // Collect events
        let viewEvents = this.events();


        // Now we add any sub-views
        if(this.views !== null) {
            for(let id in this.views) {
                let view = this.views[id];
                viewEvents[view._id] = view._render(false, element);
            }
        }

        // Are we a top-level view?
        if(this._parent === null && fragment === null) {
            // YES - without passed fragment or parent
            fragment = document.createDocumentFragment();
        }
        fragment.appendChild(element);

        if(doInsert === true) {
            jQuery(this.target).append(fragment);
        }
        return viewEvents;
    }
}

EventEmitter(BaseView.prototype);

// Exports
module.exports = BaseView;



