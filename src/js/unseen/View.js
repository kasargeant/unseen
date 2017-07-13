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

    _addEvents(element) {
        console.log("_addEvents()");

        // First we make any element ids in this View - unique.
        walk(element, function(node) {
            console.log("node", node);
            if(node.id !== null) {
                node.id = node.id + "-" + this._id;
            }
        }.bind(this));


        // let events = this.events(); // Gets an array of user-defined events.
        // if(events !== null) {
        //     for(let event of events) {
        //         let element = fragment.querySelector(event[0]);
        //         if(element) {
        //             console.log(`Listening to ${event[0]} for a '${event[1]}' event to trigger method this.${event[2]}()`);
        //             element.addEventListener(event[1], function(evt) {
        //                 console.log(`${event[0]}: ${event[1]}`);
        //                 this[event[2]](evt);
        //             }.bind(this), false);
        //         } else {
        //             console.error(`Error: Unable to bind event for selector '${event[0]}'.`);
        //         }
        //
        //     }
        // }

        // // Add blanket debug listener
        // let element = fragment.firstElementChild;
        // if(element !== null) {
        //     console.log("got element")
        //     element.addEventListener("click", function(evt) {
        //         console.log(`${evt.type}: ${evt.target.name}`);
        //     }.bind(this), false);
        // }

        // Add blanket debug listener
        if(element !== null) {
            element.addEventListener("click", function(evt) {
                console.log(`View Event '${evt.type}': ${evt.target.name}, #${evt.target.id} .${evt.target.className}`);
            }.bind(this), false);
        }
    }


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
        this._addEvents(element);

        fragment.appendChild(element);


        if(doInsert === true) {
            jQuery(this.target).append(fragment);
        } else {
            return fragment;
        }
    }

    // render() {
    //
    //     // Render view for single model
    //     if(this.subViews === null) {
    //         this.el = this.template(this.model);
    //     } else {
    //         for(let i = 0; i < this.subViews.length; i++) {
    //             this.el += this.subViews.render();
    //         }
    //     }
    //     return this.el;
    // }
    //
    // renderFragment() {
    //
    //     this.fragment = document.createDocumentFragment();
    //     let element = null;
    //
    //     // Render view for single model
    //     if(this.subViews === null) {
    //         element = document.createElement(this.tag);
    //         element.innerHTML = this.template(this.model);
    //         this.fragment.appendChild(element);
    //     } else {
    //         for(let i = 0; i < this.subViews.length; i++) {
    //             element = document.createElement(this.tag);
    //             element.innerHTML = this.subViews.render();
    //             this.fragment.appendChild(element);
    //         }
    //     }
    //     return this.fragment;
    // }
}

EventEmitter(View.prototype);

// Exports
module.exports = View;



