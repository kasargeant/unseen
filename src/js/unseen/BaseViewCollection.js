/**
 * @file BaseViewCollection.js
 * @description The Base ViewCollection class.
 * @author Kyle Alexis Sargeant <kasargeant@gmail.com> {@link https://github.com/kasargeant https://github.com/kasargeant}.
 * @copyright Kyle Alexis Sargeant 2017
 * @license See LICENSE file included in this distribution.
 */

"use strict";

// Imports
const EventEmitter = require("event-emitter");
const jQuery = require("jquery");

/**
 * The base ViewCollection class.
 * @class
 */

/**
 * @param baseClass
 * @param modelCollection
 * @param parent
 * @param id
 */
const BaseViewCollection = function(baseClass, modelCollection, parent=null, id=0) {

    // Set internally (or by parent).
    this._parent = parent;
    this._id = id;          // View ID

    // Set by user (or default).
    this.baseClass = baseClass;
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
        let model = this.model.models[id]; // Note if the 'model' IS a single model... it returns itself
        let view = new this.baseClass(model, this, id);
        this.views[id] = view;
        this.length++;
    }

    this._viewCounter = this.length; // This provides a unique ID for every view.

    this.el = "";

    // Adds internal events listener used by the ModelCollection to signal this BaseViewCollection on update.
    this.on("change", function(args) {
        console.log(`BaseViewCollection #${this._id}: Model/Collection #${args} changed.`);
        this._emit("change"); // Relay the event forward
        // jQuery(this.target).children().first().detach();
        // this._render(true);
    }.bind(this));

    // TODO - Add internal events listener used by Views signalling this BaseViewCollection
};

// LIFECYCLE METHODS

/**
 * @override
 */
BaseViewCollection.prototype.initialize = function() {};

/**
 * @override
 */
BaseViewCollection.prototype.finalize = function() {};

BaseViewCollection.prototype.destroy = function() {
    let selector = `#${this.id}-${this._id}`;
    console.log("SELECTOR" + selector);
    console.log(`View ${this._id} is being destroyed!!!`);
    jQuery(selector).remove();
};

// return [
//    ["#button-delete", "click", "deleteAction"]
// ];
BaseViewCollection.prototype.events = function() {return null;};

BaseViewCollection.prototype._emit = function(eventType) {
    if(this._parent !== null) {
        this._parent.emit(eventType, this._id);
    }
};

BaseViewCollection.prototype._handleEvents = function(evt) {
    console.log(`BaseViewCollection Event '${evt.type}': ${evt.target.name}, #${evt.target.id} .${evt.target.className}`);

    let eventTargetId = evt.target.id;
    let splitPoint = eventTargetId.lastIndexOf("-");
    let elementId = "#" + eventTargetId.slice(0, splitPoint);
    if(elementId === "#") {
        throw new Error("Missing event target.");
    }
    let viewId = eventTargetId.slice(splitPoint + 1); // +1 to step over delimiter
    // console.log(`BaseViewCollection event matched: View component '${viewId}', element ${elementId}`);
    //
    console.log(`View events are: ${JSON.stringify(this.viewEvents)}`);
    // console.log(`Have found ${this.viewEvents[viewId]} events for View component ${viewId}`);

    let events = this.viewEvents[viewId];
    let elementEvent = events[elementId];
    if(elementEvent !== undefined && elementEvent[0] === evt.type) {
        console.log(`BaseViewCollection '${evt.type}' event for component '${viewId}' element ${elementId}`);
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


};

// template(model, params) {return JSON.stringify(model);}

BaseViewCollection.prototype._render = function(doInsert=false, fragment=null) {

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
};

BaseViewCollection.prototype._renderMarkup = function(doInsert=false, markup=null) {

    let classList = [this.id]; // We add the id as a class because here - it will not be mutated/mangled.
    classList.push(...this.classList); // We add any remaining classes.

    let elementOpen = `<${this.tag} id="${this.id + "-" + this._id}" class="${classList.join(" ")}">`;
    let elementClose = "</" + this.tag + ">";
    // let elementBody = this.template(this.base, 0);
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

        this.$el = jQuery(markup.html).appendTo(this.target).get(0);

        // We don't even think about whether to add a listener if this fragment isn't being inserted into the DOM.
        if(this._parent === null) {

            // We set the viewEvents lookup
            this.viewEvents = viewEvents;

            // Add top-level event listener
            this.$el.addEventListener("click", this._handleEvents.bind(this), false);
        }
    }
    return viewEvents;
};

BaseViewCollection.prototype._deferAppend = function(html) {
    this.deferred.push(html);
};

BaseViewCollection.prototype._resolveDeferred = function() {
    if(this.deferred.length > 0) {
        jQuery(this.$el).append(this.deferred.shift());
    }
};

BaseViewCollection.prototype._renderMarkupDefer = function(doInsert=false, markup=null) {

    let classList = [this.id]; // We add the id as a class because here - it will not be mutated/mangled.
    classList.push(...this.classList); // We add any remaining classes.

    let elementOpen = `<${this.tag} id="${this.id + "-" + this._id}" class="${classList.join(" ")}">`;
    let elementClose = "</" + this.tag + ">";
    // let elementBody = this.template(this.base, 0);
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
};

EventEmitter(BaseViewCollection.prototype);

// Exports
module.exports = BaseViewCollection;



