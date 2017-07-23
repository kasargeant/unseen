/**
 * @file View.js
 * @description The View class.
 * @author Kyle Alexis Sargeant <kasargeant@gmail.com> {@link https://github.com/kasargeant https://github.com/kasargeant}.
 * @copyright Kyle Alexis Sargeant 2017
 * @license See LICENSE file included in this distribution.
 */

"use strict";

// Imports
const Component = require("./Component");

const jQuery = require("jquery");
const walk = require("./walk");

/**
 * The View class.
 *
 * Responsibilities:-
 * * To render a model's data attributes in some viewable format.
 *
 * @class
 */
class View extends Component {
    /**
     * @param {Model} model - A model instance.
     * @param {Object} [options] - Component configuration options.
     * @param {Component} [parent] - The parent (if any).
     * @param {number} [parentRef] - The parent's reference ID for this component (if any).
     * @constructor
     */
    constructor(model={}, options, parent, parentRef) {

        // Specialized component defaults
        let defaults = {
            id: "view",
            target: "main",
            tag: "div",
            classList: [],
            template: null,
            events: null
        };
        super(defaults, options, parent, parentRef);

        // Specialized component properties.
        this.baseModel = model;
        this.id = this.config.id;       // HTML Element ID
        this.target = this.config.target;
        this.tag = this.config.tag;
        this.classList = this.config.classList;
        if(this.config.template !== null) {
            this.template = this.config.template;
        }
        if(this.config.events !== null) {
            this.events = function() {return this.config.events;}.bind(this);
        }
        if(this.config.methods !== null) {
            for(let methodKey in this.config.methods) {
                this[methodKey] = this.config.methods[methodKey].bind(this);
            }
        }

        // Call user-defined lifecycle (to possible override values).
        this.initialize();  // LIFECYCLE CALL

        // Sanity check user initialization.
        if(this.baseModel === null) {
            throw new Error("View requires a base model instance.");
        }

        // Set depending on previous internal/user properties.
        this.views = null;
        this.el = "";

        // Adds internal events listener used by the ModelCollection to signal this ViewCollection on update.
        this.on("change", function(args) {
            console.log(`View #${this._id}: Model/Collection #${args} changed.`);
            this._emit("change"); // Relay the event forward
        });
    }


    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // LIFECYCLE: USER-DEFINED
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

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // LIFECYCLE: INTERNAL
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

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

    template(model, params) {return "";}

    style() {
        return "";
    }

    _renderFragment(doInsert=false, fragment=null) {

        let element = document.createElement(this.tag);
        element.id = this.id;
        element.classList.add(this.id); // We add the id as a class because here - it will not be mutated/mangled.
        element.classList.add(...this.classList); // We add any remaining classes.
        element.innerHTML = this.template(this.baseModel, 0);
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
                viewEvents[view._id] = view._renderFragment(false, element);
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

    _renderMarkup(doInsert=false, markup=null) {

        let classList = [this.id]; // We add the id as a class because here - it will not be mutated/mangled.
        classList.push(...this.classList); // We add any remaining classes.

        let elementOpen = `<${this.tag} id="${this.id + "-" + this._id}" class="${classList.join(" ")}">`;
        let elementClose = "</" + this.tag + ">";
        let elementBody = this.template(this.baseModel.get(), this._id);

        // First we make any element ids in this View - unique.
        // let matches = content.match(/(?:id|class)="([^"]*)"/gi);    // Matches class="sfasdf" or id="dfssf"
        // console.log("MATCHES: " + JSON.stringify(matches));
        elementBody = elementBody.replace(/(?:id)="([^"]*)"/gi, `id="$1-${this._id}"`);    // Matches class="sfasdf" or id="dfssf"
        // console.log("CONTENT: " + JSON.stringify(element));

        // Collect events
        let viewEvents = this.events();

        // Now we add any sub-views
        let elementChildren = {html: ""};
        if(this.views !== null) {
            for(let id in this.views) {
                let view = this.views[id];
                viewEvents[view._id] = view._renderMarkup(false, elementChildren);
            }
        }

        // Are we a top-level view?
        if(markup === null) {
            // YES - without passed fragment or parent
            markup = {html: ""};
        }
        markup.html += elementOpen + elementBody + elementChildren.html + elementClose;
        // console.log("MARKUP: " + JSON.stringify(markup.html));

        if(doInsert === true) {
            jQuery(this.target).append(markup.html);
        }
        return viewEvents;
    }
}

// Exports
module.exports = View;



