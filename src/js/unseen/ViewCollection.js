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
        this.views = {};

        // Instantiate initial View components from ModelCollection models
        this.length = 0;
        for(let id in this.model.models) {
            let model = this.model.models[id]; // Note if the 'model' IS a single model... it returns itself
            let view = new this.ViewClass(model, this, id);
            this.views[id] = view;
            this.length++;
        }

        this._viewCounter = this.length; // This provides a unique ID for every view.

        this.el = "";

        // Adds internal events listener used by the ModelCollection to signal this ViewCollection on update.
        this.on("change", function(args) {
            console.log(`ViewCollection #${this._id}: Model/Collection #${args} changed.`);
            this._emit("change"); // Relay the event forward
            jQuery(this.target).children().first().detach();
            this.renderFragment(true);
        }.bind(this));

        // TODO - Add internal events listener used by Views signalling this ViewCollection
        //
    }

    // LIFECYCLE METHODS
    initialize() {
        // Lifecycle method.
    }

    destroy() {}

    _emit(eventType) {
        if(this._parent !== null) {
            this._parent.emit(eventType, this._id);
        }
    }

    // template(model, params) {return JSON.stringify(model);}

    render(doInsert=false) {
        this.el = `<${this.tag} id="view-collection-${this._id}">`;
        for(let id in this.views) {
            this.el += this.views[id].render(false);
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
        for(let id in this.views) {
            this.el.appendChild(this.views[id].render(false));
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
        for(let id in this.views) {
            let view = this.views[id];
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

                // let modelId = this.views[viewId].model._id;
                // console.log("Have model id: " + modelId);

                // Note viewId ALWAYS the same as modelId - i.e. one-to-one correspondence.
                delete this.views[viewId];
                this.model.emit("view-remove", viewId);
            }.bind(this), false);
        }
    }
}

EventEmitter(ViewCollection.prototype);

// Exports
module.exports = ViewCollection;



