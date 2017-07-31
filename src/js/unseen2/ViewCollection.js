/**
 * @file ViewCollection.js
 * @description The ViewCollection class.
 * @author Kyle Alexis Sargeant <kasargeant@gmail.com> {@link https://github.com/kasargeant https://github.com/kasargeant}.
 * @copyright Kyle Alexis Sargeant 2017
 * @license See LICENSE file included in this distribution.
 */

"use strict";

// Imports
const EventEmitter = require("event-emitter");
const jQuery = require("jquery");

/**
 * The ViewCollection class.
 *
 * Responsibilities:-
 * * To store Views,
 * * To collect the rendering of all contained Views,
 * * To handle all related events.
 * @class
 */
class ViewCollection {

    /**
     * @param {ModelList} modelCollection - An instantiated ModelList object.
     * @constructor
     */
    /**
     * @param {Array} views - An array of View and/or ViewList instances.
     * @param {Object} [options={}] - Instance options to override class/custom defaults.
     * @param {ViewCollection} [parent] - The parent (if any).
     * @param {number} [parentRef] - The parent's reference ID for this component (if any).
     * @constructor
     */
    constructor(views = {}, options = {}, parent = null, parentRef = null) {

        // Component defaults
        this.defaults = {
            views: {},
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
        this.views = views || options.views || this.views || this.defaults.views;
        this.target = options.target || this.target || this.defaults.target;
        this.tag = options.tag || this.tag || this.defaults.tag;
        this.id = options.id || this.id || this.defaults.id;
        this.classList = options.classList || this.classList || this.defaults.baseModel;

        // // Sanity check user initialization.
        // if(this.baseClass === null) {
        //     throw new Error("ViewCollection requires a base View class.");
        // }

        // Set depending on previous internal/user properties.
        this.el = "";
        this.$el = null;
        this.deferred = [];

        // Adds events listener(s).
        // this.collection.on("reset", function(args) {
        //     console.log(`ViewCollection #${this._id}: ModelList #${args} changed.`);
        //     this._emit("reset"); // Relay the event forward
        //     // jQuery(this.target).children().first().detach();
        //     this.reset(this.collection.models);
        //     this._renderMarkup(true);
        // }.bind(this));
    }

    reset(views) {
        this.views = views;
    }

    add(id, view) {
        this.views[id] = view;
    }

    remove(id) {
        this.views[id].finalize();
        delete this.views[id];
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
        //console.log(`View events are: ${JSON.stringify(this.viewEvents)}`);

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
                // this.collection.emit("view-remove", viewId);
            }
        }

        // let modelId = this.views[viewId].model._id;
        // console.log("Have model id: " + modelId);


    }

    // template(model, params) {return JSON.stringify(model);}


    render(doInsert=false, markup=null, throttle=false) {
        this._renderMarkup(doInsert, markup);
    }


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

EventEmitter(ViewCollection.prototype);

// Exports
module.exports = ViewCollection;



