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

class ViewCollection {
    constructor(ViewClass, modelCollection, parent=null, id=0) {

        this._parent = parent;
        this._id = id;

        this.target = "main";
        this.tag = "section";

        this.ViewClass = ViewClass;
        this.model = modelCollection;
        this.model._parent = this;
        this.views = [];

        // let i;
        // for(i = 0; i < this.model.length; i++) {
        //     let model = this.model.get(i); // Note if the 'model' IS a single model... it returns itself
        //     let view = new this.ViewClass(model, this, i);
        //     this.views.push(view);
        // }
        for(let id in this.model.models) {
            let model = this.model.models[id]; // Note if the 'model' IS a single model... it returns itself
            let view = new this.ViewClass(model, this, id);
            this.views.push(view);
        }

        this.length = this.views.length;
        this._viewCounter = this.views.length; // This provides a unique ID for every view.

        this.el = "";

        this.fragment = null;

        this.on("change", function(args) {
            console.log(`ViewCollection #${this._id}: Model/Collection #${args} changed.`);
            this._emit("change"); // Relay the event forward
        });
    }

    // LIFECYCLE METHODS
    initialize() {
        // Lifecycle method.
    }
    destroy() {}

    _addEvents(element) {
        console.log("_addEvents()");
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
                console.log(`ViewCollection Event '${evt.type}': ${evt.target.name}, #${evt.target.id} .${evt.target.className}`);

                let eventTargetId = evt.target.id;
                let splitPoint = eventTargetId.lastIndexOf("-");
                let elementId = eventTargetId.slice(0, splitPoint);
                let viewId = eventTargetId.slice(splitPoint + 1); // +1 to step over delimiter
                console.log(`ViewCollection event matched: View component '${viewId}', element ${elementId}`);

            }.bind(this), false);
        }
    }

    _emit(eventType) {
        if(this._parent !== null) {
            this._parent.emit(eventType, this._id);
        }
    }

    // template(model, params) {return JSON.stringify(model);}

    render(doInsert=false) {
        this.el = `<${this.tag} id="view-collection-${this._id}">`;
        for(let i = 0; i < this.views.length; i++) {
            this.el += this.views[i].render(false);
        }
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
        this.el.id = `view-collection-${this._id}`;
        for(let i = 0; i < this.views.length; i++) {
            this.el.appendChild(this.views[i].render(false));
        }
        if(doInsert === true) {
            jQuery(this.target).append(this.el);
        } else {
            return this.el;
        }
    }

    renderFragment(doInsert=false, fragment=null) {

        let viewEvents = {};

        // Are we a top-level view?
        if(fragment === null && this._parent === null) {
            // YES - without passed fragment or parent
            fragment = document.createDocumentFragment();
        }
        let element = document.createElement(this.tag);
        element.id = `view-collection-${this._id}`;
        for(let i = 0; i < this.views.length; i++) {
            let view = this.views[i];
            viewEvents[view._id] = view.renderFragment(false, element);
        }

        fragment.appendChild(element);

        if(doInsert === true) {
            jQuery(this.target).append(fragment);
        }
        if(this._parent === null) {
            element.addEventListener("click", function(evt) {
                console.log(`ViewCollection Event '${evt.type}': ${evt.target.name}, #${evt.target.id} .${evt.target.className}`);

                let eventTargetId = evt.target.id;
                let splitPoint = eventTargetId.lastIndexOf("-");
                let elementId = eventTargetId.slice(0, splitPoint);
                let viewId = eventTargetId.slice(splitPoint + 1); // +1 to step over delimiter
                console.log(`ViewCollection event matched: View component '${viewId}', element ${elementId}`);
                console.log(`Have found ${viewEvents[viewId]} events for View component ${viewId}`);
                
            }.bind(this), false);
        }
    }
}

EventEmitter(ViewCollection.prototype);

// Exports
module.exports = ViewCollection;



