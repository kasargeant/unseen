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

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // CONSTRUCTOR
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    constructor(modelCollection, parent=null, id=0) {

        // Set internally (or by parent).
        this._parent = parent;
        this._id = id;          // View ID

        // Set by user (or default).
        this.ViewClass = null;
        this.id = "view";       // HTML Element ID
        this.target = "main";
        this.tag = "div";
        this.classList = [];
        this.initialize();  // LIFECYCLE CALL: INITIALIZE

        // Calculated from previous internal/user properties.
        this.model = modelCollection;
        this.model._parent = this;
        this.views = {};

        // Instantiate initial View components from ModelCollection models
        this.length = 0;
        for(let id in this.model.models) {
            let view = new this.ViewClass(this, id);
            let model = this.model.models[id]; // Note if the 'model' IS a single model... it returns itself
            view.model = model;
            this.views[id] = view;
            this.length++;
        }

        this._viewCounter = this.length; // This provides a unique ID for every view.

        this.el = "";

        // Adds internal events listener used by the ModelCollection to signal this ViewCollection on update.
        this.on("change", function(args) {
            console.log(`ViewCollection #${this._id}: Model/Collection #${args} changed.`);
            this._emit("change"); // Relay the event forward
            // jQuery(this.target).children().first().detach();
            // this._render(true);
        }.bind(this));

        // TODO - Add internal events listener used by Views signalling this ViewCollection
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // LIFECYCLE METHODS
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    /**
     * @override
     */
    initialize() {}

    /**
     * @override
     */
    finalize() {}

    destroy() {
        let selector = `#${this.id}-${this._id}`;
        console.log("SELECTOR" + selector);
        console.log(`View ${this._id} is being destroyed!!!`);
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

    _handleEvents(evt) {
        console.log(`ViewCollection Event '${evt.type}': ${evt.target.name}, #${evt.target.id} .${evt.target.className}`);

        let eventTargetId = evt.target.id;
        let splitPoint = eventTargetId.lastIndexOf("-");
        let elementId = "#" + eventTargetId.slice(0, splitPoint);
        if(elementId === "#") {
            throw new Error("Missing event target.");
        }
        let viewId = eventTargetId.slice(splitPoint + 1); // +1 to step over delimiter
        // console.log(`ViewCollection event matched: View component '${viewId}', element ${elementId}`);
        //
        console.log(`View events are: ${JSON.stringify(this.viewEvents)}`);
        // console.log(`Have found ${this.viewEvents[viewId]} events for View component ${viewId}`);

        let events = this.viewEvents[viewId];
        let elementEvent = events[elementId];
        if(elementEvent !== undefined && elementEvent[0] === evt.type) {
            console.log(`ViewCollection '${evt.type}' event for component '${viewId}' element ${elementId}`);
            // Note viewId ALWAYS the same as modelId - i.e. one-to-one correspondence.
            let view = this.views[viewId];
            if(view !== undefined) {
                view[elementEvent[1]]();

                // DELETE A VIEW
                // this.views[viewId]._destroy(); // Always call private life-cycle method first.
                // delete this.views[viewId];
                // this.model.emit("view-remove", viewId);
            }
        }

        // let modelId = this.views[viewId].model._id;
        // console.log("Have model id: " + modelId);


    }

    // template(model, params) {return JSON.stringify(model);}

    _render(doInsert=false, fragment=null) {

        let viewEvents = {};

        let element = document.createElement(this.tag);
        element.id = this.id + "-" + this._id;
        element.classList.add(this.id); // We add the id as a class because here - it will not be mutated/mangled.
        element.classList.add(...this.classList); // We add any remaining classes.
        for(let id in this.views) {
            let view = this.views[id];
            viewEvents[view._id] = view._render(false, element);
        }

        // Are we a top-level view?
        if(this._parent === null && fragment === null) {
            // YES - without passed fragment or parent
            fragment = document.createDocumentFragment();
        }
        fragment.appendChild(element);

        if(doInsert === true) {
            jQuery(this.target).append(fragment);

            // We don't even think about whether to add a listener if this fragment isn't being inserted into the DOM.
            if(this._parent === null) {

                // We set the viewEvents lookup
                this.viewEvents = viewEvents;

                // Add top-level event listener
                element.addEventListener("click", this._handleEvents.bind(this), false);
            }
        }
        return viewEvents;
    }
}

EventEmitter(ViewCollection.prototype);

// Exports
module.exports = ViewCollection;



