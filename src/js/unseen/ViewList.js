/**
 * @file ViewList.js
 * @description The ViewList class.
 * @author Kyle Alexis Sargeant <kasargeant@gmail.com> {@link https://github.com/kasargeant https://github.com/kasargeant}.
 * @copyright Kyle Alexis Sargeant 2017
 * @license See LICENSE file included in this distribution.
 */

"use strict";

// Imports
const EventEmitter = require("event-emitter");
const jQuery = require("jquery");

/**
 * The ViewList class.
 *
 * Responsibilities:-
 * * To store Views,
 * * To collect the rendering of all contained Views,
 * * To handle all related events.
 * @class
 */
class ViewList {

    /**
     * @param {ModelList} modelCollection - An instantiated ModelList object.
     * @constructor
     */
    /**
     * @param {Object} collection - A ModelCollection instance.
     * @param {Object} [options={}] - Instance options to override class/custom defaults.
     * @param {ViewList} [parent] - The parent (if any).
     * @param {number} [parentRef] - The parent's reference ID for this component (if any).
     * @constructor
     */
    constructor(collection = {}, options = {}, parent = null, parentRef = null) {

        // Component defaults
        this.defaults = {
            baseClass: null,
            collection: null,
            views: null,
            useDOM: true,
            target: "main",
            tag: "div",
            id: "view",      // HTML Element ID
            classList: []
        };

        // Set internally (or by parent).
        this._parent = parent;  // The parent component (if any).
        this._id = parentRef;   // The parent's reference ID for this component (if any).

        // Set by user (or default).
        // Order of precedence is: Custom properties -then-> Instance options -then-> class defaults.
        this.initialize();      // Custom initialization.
        this.baseClass = options.baseClass || this.baseClass || this.defaults.baseClass;
        this.collection = collection || options.collection || this.collection || this.defaults.collection;
        if(this.collection !== null) {this.collection._parent = this;}
        this.views = options.views || this.views || this.defaults.views;
        this.useDOM = options.useDOM || this.useDOM || this.defaults.useDOM;
        this.target = options.target || this.target || this.defaults.target;
        this.tag = options.tag || this.tag || this.defaults.tag;
        this.id = options.id || this.id || this.defaults.id;
        this.classList = options.classList || this.classList || this.defaults.baseModel;

        // // Sanity check user initialization.
        // if(this.baseClass === null) {
        //     throw new Error("ViewList requires a base View class.");
        // }

        // Set depending on previous internal/user properties.
        this.el = "";
        this.$el = null;
        this.deferred = [];

        // Adds internal events listener used by the ModelList to signal this ViewList on update.
        this.on("change", function(args) {
            console.log(`ViewList #${this._id}: Model/Collection #${args} changed.`);
            this._emit("change"); // Relay the event forward
            // jQuery(this.target).children().first().detach();
            // this._renderFragment(true);
        }.bind(this));

        this.collection.on("reset", function(args) {
            console.log(`ViewList #${this._id}: ModelList #${args} changed.`);
            this._emit("reset"); // Relay the event forward
            // jQuery(this.target).children().first().detach();
            this.reset(this.collection.models);
            if(this.useDOM === true) {
                this._renderMarkup(true);
            } else {
                let markup = {html: ""};
                this._renderMarkup(false, markup);
                console.log(markup.html);
            }

        }.bind(this));

        // TODO - Add internal events listener used by Views signalling this ViewList
    }

    reset(models) {
        // Instantiate initial View components from ModelList models
        this.views = {};
        this.length = 0;
        for(let id in models) {

            // Retrieve associated model from collection.
            let model = models[id]; // Note if the 'model' IS a single model... it returns itself

            // Instantiate view and set private properties.
            let view = new this.baseClass(model, {}, this, id);

            // Now add newly created View to store.
            this.views[id] = view;
            this.length++;
        }
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // USER LIFECYCLE METHODS
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    /**
     * A lifecycle method - called when the instance is first constructed.
     * @override
     */
    initialize() {}

    /**
     * A lifecycle method - called when the instance is about to be destroyed.
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
        console.log(`ViewList Event '${evt.type}': ${evt.target.name}, #${evt.target.id} .${evt.target.className}`);

        let eventTargetId = evt.target.id;
        let splitPoint = eventTargetId.lastIndexOf("-");
        let elementId = "#" + eventTargetId.slice(0, splitPoint);
        if(elementId === "#") {
            throw new Error("Missing event target.");
        }
        let viewId = eventTargetId.slice(splitPoint + 1); // +1 to step over delimiter
        // console.log(`ViewList event matched: View component '${viewId}', element ${elementId}`);
        //
        //console.log(`View events are: ${JSON.stringify(this.viewEvents)}`);

        let events = this.viewEvents[viewId];
        let elementEvent = events[elementId];
        if(elementEvent !== undefined && elementEvent[0] === evt.type) {
            console.log(`ViewList '${evt.type}' event for component '${viewId}' element ${elementId}`);
            // Note viewId ALWAYS the same as modelId - i.e. one-to-one correspondence.
            let view = this.views[viewId];
            if(view !== undefined) {
                view[elementEvent[1]]();

                // DELETE A VIEW
                // this.views[viewId]._destroy(); // Always call private life-cycle method first.
                // delete this.views[viewId];
                // this.collection.emit("view-remove", viewId);
            }
        }

        // let modelId = this.views[viewId].model._id;
        // console.log("Have model id: " + modelId);


    }

    // template(model, params) {return JSON.stringify(model);}

    _renderFragment(doInsert=false, fragment=null) {

        let element = document.createElement(this.tag);
        element.id = this.id + "-" + this._id;
        element.classList.add(this.id); // We add the id as a class because here - it will not be mutated/mangled.
        element.classList.add(...this.classList); // We add any remaining classes.

        // Collect events
        let viewEvents = {};

        // Now we add any sub-views
        for(let id in this.views) {
            let view = this.views[id];
            viewEvents[view._id] = view._renderFragment(false, element);
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

    _renderMarkup(doInsert=false, markup=null) {

        let classList = [this.id]; // We add the id as a class because here - it will not be mutated/mangled.
        classList.push(...this.classList); // We add any remaining classes.

        let elementOpen = `<${this.tag} id="${this.id + "-" + this._id}" class="${classList.join(" ")}">`;
        let elementClose = "</" + this.tag + ">";
        // let elementBody = this.template(this.baseModel, 0);
        let elementBody = "";

        // First we make any element ids in this View - unique.
        elementBody = elementBody.replace(/(?:id)="([^"]*)"/gi, `id="$1-${this._id}"`);    // Matches class="sfasdf" or id="dfssf"
        // console.log("CONTENT: " + JSON.stringify(element.html));

        // Collect events
        let viewEvents = {};

        // Now we add any sub-views
        let elementChildren = {html: ""};
        for(let id in this.views) {
            let view = this.views[id];
            viewEvents[view._id] = view._renderMarkup(false, elementChildren);
        }

        // Are we a top-level view?
        if(this._parent === null && markup === null) {
            // YES - without passed fragment or parent
            markup = {html: ""};
        }
        markup.html += elementOpen + elementBody + elementChildren.html + elementClose;
        // console.log("MARKUP: " + JSON.stringify(markup.html));

        if(doInsert === true) {
            // jQuery(this.target).append(markup);
            console.log(`Appending to ${this.target}`);
            this.$el = jQuery(markup.html).appendTo(this.target).get(0);
            if(this.$el === undefined) {throw new Error("Unable to find DOM target to append to.");}

            // We don't even think about whether to add a listener if this fragment isn't being inserted into the DOM.
            if(this._parent === null) {

                // We set the viewEvents lookup
                this.viewEvents = viewEvents;

                // Add top-level event listener
                this.$el.addEventListener("click", this._handleEvents.bind(this), false);
            }
        }
        return viewEvents;
    }

    _deferAppend(html) {
        this.deferred.push(html);
    }

    _resolveDeferred() {
        if(this.deferred.length > 0) {
            jQuery(this.$el).append(this.deferred.shift());
        }
    }

    _renderMarkupDefer(doInsert=false, markup=null) {

        let classList = [this.id]; // We add the id as a class because here - it will not be mutated/mangled.
        classList.push(...this.classList); // We add any remaining classes.

        let elementOpen = `<${this.tag} id="${this.id + "-" + this._id}" class="${classList.join(" ")}">`;
        let elementClose = "</" + this.tag + ">";
        // let elementBody = this.template(this.baseModel, 0);
        let elementBody = "";

        // First we make any element ids in this View - unique.
        elementBody = elementBody.replace(/(?:id)="([^"]*)"/gi, `id="$1-${this._id}"`);    // Matches class="sfasdf" or id="dfssf"
        // console.log("CONTENT: " + JSON.stringify(element.html));

        // Collect events
        let viewEvents = {};

        if(doInsert === true) {
            let html = elementOpen + elementBody + elementClose;
            this.$el = jQuery(html).appendTo(this.target).get(0);

            // start deferred markup handling
            // intervalID = window.setInterval(this._resolveDeferred.bind(this), 500);
            console.time("deferred");
            let intervalID = setInterval(function() {
                if(this.deferred.length > 0) {
                    jQuery(this.$el).append(this.deferred.shift());
                } else {
                    clearInterval(intervalID);
                    // console.log("Deferred timer self-terminated.");
                    console.timeEnd("deferred");
                }
            }.bind(this), 300);
        }

        // Now we add any sub-views
        let elementChildren = {html: ""};
        for(let id in this.views) {
            let view = this.views[id];
            viewEvents[view._id] = view._renderMarkup(false, elementChildren);

            if(doInsert === true && elementChildren.html.length > 20000) {
                this._deferAppend(elementChildren.html);
                elementChildren.html = "";
            }
        }
        if(elementChildren.html.length > 0) {
            this._deferAppend(elementChildren.html);
            elementChildren.html = "";
        }

        // Are we a top-level view?
        if(this._parent === null && markup === null) {
            // YES - without passed fragment or parent
            markup = {html: ""};
        }

        if(doInsert === true) {

            // We don't even think about whether to add a listener if this fragment isn't being inserted into the DOM.
            if(this._parent === null) {

                // We set the viewEvents lookup
                this.viewEvents = viewEvents;

                // Add top-level event listener
                this.$el.addEventListener("click", this._handleEvents.bind(this), false);
            }
        } else {
            markup.html += elementOpen + elementBody + elementChildren.html + elementClose;
            // console.log("MARKUP: " + JSON.stringify(markup.html));
        }
        return viewEvents;
    }

}

EventEmitter(ViewList.prototype);

// Exports
module.exports = ViewList;


